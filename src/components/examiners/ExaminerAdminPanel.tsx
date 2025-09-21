'use client';

import Image from 'next/image';

import {
  ChangeEvent,
  FormEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import type {
  ExaminerAdminPanelHandle,
  ExaminerFormInput,
  ExaminerProfile,
  FeedbackState,
} from './examinerTypes';

interface ExaminerAdminPanelProps {
  onRefreshPublished: () => Promise<void>;
}

const DEFAULT_CATEGORY = 'funding';
const DEFAULT_FORM: ExaminerFormInput = {
  name: '',
  position: '',
  companyName: '',
  category: DEFAULT_CATEGORY,
  specialties: '',
  imageUrl: '',
  imageAlt: '',
  sortOrder: 0,
  isPublished: true,
  legacyKey: '',
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];


const CATEGORY_OPTIONS = [
  { value: 'funding', label: '정책자금' },
  { value: 'certification', label: '인증' },
  { value: 'export', label: '수출' },
  { value: 'manufacturing', label: '제조혁신' },
  { value: 'startup', label: '창업' },
] as const;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'examiner';
export const ExaminerAdminPanel = forwardRef<ExaminerAdminPanelHandle, ExaminerAdminPanelProps>(
  function ExaminerAdminPanel({ onRefreshPublished }: ExaminerAdminPanelProps, ref) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [verifyFeedback, setVerifyFeedback] = useState<FeedbackState>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isAdminVerified, setIsAdminVerified] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');

    const [adminExaminers, setAdminExaminers] = useState<ExaminerProfile[]>([]);
    const [isLoadingAdminExaminers, setIsLoadingAdminExaminers] = useState(false);
    const [adminListError, setAdminListError] = useState<string | null>(null);

    const [formState, setFormState] = useState<ExaminerFormInput>(DEFAULT_FORM);
    const [formFeedback, setFormFeedback] = useState<FeedbackState>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [imageFeedback, setImageFeedback] = useState<FeedbackState>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [pendingUploadKey, setPendingUploadKey] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const sortedAdminExaminers = useMemo(() => {
      // 중복 제거: _id 기준으로 unique 처리
      const uniqueMap = new Map<string, ExaminerProfile>();
      adminExaminers.forEach(examiner => {
        if (examiner._id && !uniqueMap.has(examiner._id)) {
          uniqueMap.set(examiner._id, examiner);
        }
      });
      const uniqueExaminers = Array.from(uniqueMap.values());

      return uniqueExaminers.sort((a, b) => {
        const orderA = typeof a.sortOrder === 'number' ? a.sortOrder : 0;
        const orderB = typeof b.sortOrder === 'number' ? b.sortOrder : 0;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return a.name.localeCompare(b.name);
      });
    }, [adminExaminers]);

    const openModal = useCallback(() => {
      setIsModalOpen(true);
      setPasswordInput('');
      setVerifyFeedback(null);
    }, []);

    const closeModal = useCallback(() => {
      if (isVerifying) return;
      setIsModalOpen(false);
    }, [isVerifying]);
    useImperativeHandle(ref, () => ({ openModal }), [openModal]);

    const fetchAdminExaminers = useCallback(async (password: string) => {
      try {
        setIsLoadingAdminExaminers(true);
        setAdminListError(null);
        const response = await fetch('/api/expert-services/examiners?includeHidden=true', {
          headers: { 'x-admin-password': password },
          cache: 'no-store',
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.message ?? '심사관 정보를 불러오지 못했습니다.');
        }
        const list = Array.isArray(data?.examiners) ? (data.examiners as ExaminerProfile[]) : [];
        setAdminExaminers(list);
      } catch (error) {
        console.error('[ExaminerAdminPanel] fetchAdminExaminers', error);
        setAdminExaminers([]);
        setAdminListError('심사관 정보를 불러오지 못했습니다.');
      } finally {
        setIsLoadingAdminExaminers(false);
      }
    }, []);

    const deleteUpload = useCallback(
      async (objectKey: string) => {
        if (!adminPassword) {
          return false;
        }
        try {
          const response = await fetch('/api/expert-services/assets/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: adminPassword, objectKey }),
          });
          if (!response.ok) {
            throw new Error('업로드한 파일을 삭제하지 못했습니다.');
          }
          return true;
        } catch (error) {
          console.error('[ExaminerAdminPanel] deleteUpload', error);
          setImageFeedback({
            type: 'error',
            text: error instanceof Error ? error.message : '업로드한 파일을 삭제하지 못했습니다.',
          });
          return false;
        }
      },
      [adminPassword]
    );

    const uploadImage = useCallback(
      async (file: File) => {
        if (!adminPassword) {
          setImageFeedback({
            type: 'error',
            text: '이미지를 업로드하려면 관리자 비밀번호를 먼저 인증해주세요.',
          });
          return;
        }

        setIsUploadingImage(true);
        setImageFeedback(null);

        if (pendingUploadKey) {
          await deleteUpload(pendingUploadKey);
          setPendingUploadKey(null);
        }

        try {
          const response = await fetch('/api/expert-services/assets/presign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              password: adminPassword,
              fileName: file.name,
              contentType: file.type || 'application/octet-stream',
            }),
          });
          const data = await response.json().catch(() => null);
          if (!response.ok) {
            throw new Error(data?.message ?? '업로드 URL을 요청하지 못했습니다.');
          }

          const { uploadUrl, objectKey, publicUrl } = data ?? {};
          if (!uploadUrl || !objectKey || !publicUrl) {
            throw new Error('잘못된 업로드 응답입니다.');
          }

          const uploadResponse = await fetch(uploadUrl as string, {
            method: 'PUT',
            headers: { 'Content-Type': file.type || 'application/octet-stream' },
            body: file,
          });

          if (!uploadResponse.ok) {
            throw new Error('이미지 업로드에 실패했습니다.');
          }

          setFormState((prev) => ({ ...prev, imageUrl: publicUrl as string }));
          setPendingUploadKey(objectKey as string);
          setImageFeedback({ type: 'success', text: '이미지 업로드가 완료되었습니다.' });
        } catch (error) {
          console.error('[ExaminerAdminPanel] uploadImage', error);
          setImageFeedback({
            type: 'error',
            text: error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.',
          });
        } finally {
          setIsUploadingImage(false);
        }
      },
      [adminPassword, deleteUpload, pendingUploadKey]
    );

    const resetForm = useCallback(
      async (options?: { preserveImage?: boolean }) => {
        if (!options?.preserveImage && pendingUploadKey) {
          await deleteUpload(pendingUploadKey);
        }
        setFormState(DEFAULT_FORM);
        setFormFeedback(null);
        setImageFeedback(null);
        setPendingUploadKey(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
      [deleteUpload, pendingUploadKey]
    );
    useEffect(() => {
      return () => {
        if (pendingUploadKey) {
          void deleteUpload(pendingUploadKey);
        }
      };
    }, [deleteUpload, pendingUploadKey]);

    const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = passwordInput.trim();
      if (!trimmed) {
        setVerifyFeedback({ type: 'error', text: '관리자 비밀번호를 입력해주세요.' });
        return;
      }

      try {
        setIsVerifying(true);
        setVerifyFeedback(null);
        const response = await fetch('/api/expert-services/examiners/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: trimmed }),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.message ?? '비밀번호 확인에 실패했습니다.');
        }

        setAdminPassword(trimmed);
        setIsAdminVerified(true);
        setIsModalOpen(false);
        setPasswordInput('');
        await fetchAdminExaminers(trimmed);
      } catch (error) {
        console.error('[ExaminerAdminPanel] verify', error);
        setVerifyFeedback({
          type: 'error',
          text: error instanceof Error ? error.message : '비밀번호 확인에 실패했습니다.',
        });
      } finally {
        setIsVerifying(false);
      }
    };

    const handleFormChange = <K extends keyof ExaminerFormInput>(
      field: K,
      value: ExaminerFormInput[K]
    ) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        setImageFeedback({ type: 'error', text: '이미지는 최대 5MB까지 업로드할 수 있습니다.' });
        event.target.value = '';
        return;
      }

      if (file.type && !ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setImageFeedback({
          type: 'error',
          text: 'JPG, PNG, WEBP, AVIF 형식만 지원합니다.',
        });
        event.target.value = '';
        return;
      }

      await uploadImage(file);
    };

    const handleClearImage = async () => {
      if (pendingUploadKey) {
        await deleteUpload(pendingUploadKey);
      }
      setPendingUploadKey(null);
      setFormState((prev) => ({ ...prev, imageUrl: '' }));
      setImageFeedback(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!adminPassword) {
        setFormFeedback({ type: 'error', text: '먼저 관리자 비밀번호를 인증해주세요.' });
        return;
      }

      const trimmedName = formState.name.trim();
      const trimmedPosition = formState.position.trim();
      if (!trimmedName || !trimmedPosition) {
        setFormFeedback({ type: 'error', text: '이름과 직함은 필수 입력 항목입니다.' });
        return;
      }

      if (!formState.imageUrl.trim()) {
        setFormFeedback({ type: 'error', text: '프로필 이미지를 업로드해주세요.' });
        return;
      }

      const trimmedCategory =
        typeof formState.category === 'string' && formState.category.trim()
          ? formState.category.trim()
          : DEFAULT_CATEGORY;

      const normalizedLegacyKey = slugify(
        formState.legacyKey.trim() ? formState.legacyKey.trim() : trimmedName
      );

      const payload = {
        password: adminPassword,
        category: trimmedCategory,
        legacyKey: normalizedLegacyKey,
        name: trimmedName,
        position: trimmedPosition,
        companyName: formState.companyName.trim(),
        specialties: formState.specialties,
        imageUrl: formState.imageUrl.trim(),
        imageAlt: formState.imageAlt.trim(),
        sortOrder: Number.isFinite(formState.sortOrder) ? formState.sortOrder : 0,
        isPublished: formState.isPublished,
      };

      const endpoint = formState._id
        ? `/api/expert-services/examiners/${formState._id}`
        : '/api/expert-services/examiners';
      const method = formState._id ? 'PUT' : 'POST';

      try {
        setIsSaving(true);
        setFormFeedback(null);
        const response = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.message ?? '심사관 정보를 저장하지 못했습니다.');
        }

        setFormFeedback({
          type: 'success',
          text: formState._id ? '심사관 정보가 수정되었습니다.' : '심사관 정보가 등록되었습니다.',
        });
        setPendingUploadKey(null);
        await fetchAdminExaminers(adminPassword);
        await onRefreshPublished();
        if (formState._id) {
          setFormState((prev) => ({ ...prev, _id: data?.examiner?._id ?? prev._id }));
        } else {
          await resetForm({ preserveImage: true });
        }
      } catch (error) {
        console.error('[ExaminerAdminPanel] save', error);
        setFormFeedback({
          type: 'error',
          text: error instanceof Error ? error.message : '심사관 정보를 저장하지 못했습니다.',
        });
      } finally {
        setIsSaving(false);
      }
    };

    const handleEdit = async (examiner: ExaminerProfile) => {
      await resetForm({ preserveImage: true });
      setFormState({
        _id: examiner._id,
        name: examiner.name ?? '',
        position: examiner.position ?? '',
        companyName: examiner.companyName ?? '',
        category: examiner.category ?? DEFAULT_CATEGORY,
        specialties: (examiner.specialties ?? []).join(', '),
        imageUrl: examiner.imageUrl ?? '',
        imageAlt: examiner.imageAlt ?? '',
        sortOrder: typeof examiner.sortOrder === 'number' ? examiner.sortOrder : 0,
        isPublished: examiner.isPublished ?? true,
        legacyKey: examiner.legacyKey ?? '',
      });
      setFormFeedback(null);
      setImageFeedback(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    const handleDelete = async (examiner: ExaminerProfile) => {
      if (!adminPassword) {
        setFormFeedback({ type: 'error', text: '먼저 관리자 비밀번호를 인증해주세요.' });
        return;
      }

      if (!examiner._id) {
        return;
      }

      const confirmed = window.confirm(`"${examiner.name}" 심사관을 삭제하시겠습니까?`);
      if (!confirmed) {
        return;
      }

      try {
        const response = await fetch(`/api/expert-services/examiners/${examiner._id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: adminPassword }),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.message ?? '심사관 정보를 삭제하지 못했습니다.');
        }

        if (formState._id === examiner._id) {
          await resetForm();
        }
        await fetchAdminExaminers(adminPassword);
        await onRefreshPublished();
      } catch (error) {
        console.error('[ExaminerAdminPanel] delete', error);
        setFormFeedback({
          type: 'error',
          text: error instanceof Error ? error.message : '심사관 정보를 삭제하지 못했습니다.',
        });
      }
    };

    return (
      <section className="mt-24">
        <div className="layout-container">
          {isAdminVerified ? (
            <div className="rounded-3xl bg-white p-8 shadow ring-1 ring-slate-100">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">심사관 정보</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Fill out every required field and upload a square profile image (recommended
                      560 × 720px).
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="font-semibold text-slate-700">이름 *</span>
                      <input
                        value={formState.name}
                        onChange={(event) => handleFormChange('name', event.target.value)}
                        className="rounded-xl border border-slate-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        required
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="font-semibold text-slate-700">직함 *</span>
                      <input
                        value={formState.position}
                        onChange={(event) => handleFormChange('position', event.target.value)}
                        className="rounded-xl border border-slate-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        required
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="font-semibold text-slate-700">소속</span>
                      <input
                        value={formState.companyName}
                        onChange={(event) => handleFormChange('companyName', event.target.value)}
                        className="rounded-xl border border-slate-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="font-semibold text-slate-700">주요 분야 *</span>
                      <select
                        value={formState.category}
                        onChange={(event) => handleFormChange('category', event.target.value)}
                        className="rounded-xl border border-slate-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        required
                      >
                        {CATEGORY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col gap-2 text-sm md:col-span-2">
                      <span className="font-semibold text-slate-700">
                        전문 분야 (쉼표로 구분)
                      </span>
                      <input
                        value={formState.specialties}
                        onChange={(event) => handleFormChange('specialties', event.target.value)}
                        className="rounded-xl border border-slate-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="예: 자금조달, 인증"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm md:col-span-2">
                      <span className="font-semibold text-slate-700">
                        연동 키 (선택)
                      </span>
                      <input
                        value={formState.legacyKey}
                        onChange={(event) => handleFormChange('legacyKey', event.target.value)}
                        className="rounded-xl border border-slate-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="미입력 시 이름으로 자동 생성됩니다."
                      />
                      <span className="text-xs text-slate-400">
                        정책 콘텐츠 및 다른 모듈과 연동할 때 사용합니다.
                      </span>
                    </label>
                  </div>

                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-semibold text-slate-700">이미지 대체 텍스트</span>
                    <input
                      value={formState.imageAlt}
                      onChange={(event) => handleFormChange('imageAlt', event.target.value)}
                      className="rounded-xl border border-slate-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="스크린 리더용 간단한 설명"
                    />
                  </label>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-700">프로필 이미지 *</p>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                        {formState.imageUrl ? (
                          <Image
                            src={formState.imageUrl}
                            alt={formState.name || '심사관 썸네일'}
                            width={160}
                            height={160}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <span className="text-xs text-slate-400">이미지 없음</span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={ACCEPTED_IMAGE_TYPES.join(',')}
                          onChange={handleImageSelect}
                          className="text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-400 hover:text-blue-600"
                            disabled={isUploadingImage}
                          >
                            {isUploadingImage ? '업로드 중…' : '이미지 선택'}
                          </button>
                          {formState.imageUrl ? (
                            <button
                              type="button"
                              onClick={() => void handleClearImage()}
                              className="inline-flex items-center justify-center rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:border-rose-400"
                              disabled={isUploadingImage}
                            >
                              Remove
                            </button>
                          ) : null}
                        </div>
                        <p className="text-xs text-slate-400">최대 5MB, JPG/PNG/WEBP/AVIF 형식 지원</p>
                        {imageFeedback ? (
                          <p
                            className={`text-xs ${
                              imageFeedback.type === 'error' ? 'text-rose-600' : 'text-emerald-600'
                            }`}
                          >
                            {imageFeedback.text}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="font-semibold text-slate-700">노출 순서</span>
                      <input
                        type="number"
                        value={formState.sortOrder}
                        onChange={(event) => {
                          const value = Number(event.target.value);
                          handleFormChange('sortOrder', Number.isFinite(value) ? value : 0);
                        }}
                        className="rounded-xl border border-slate-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </label>
                    <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={formState.isPublished}
                        onChange={(event) => handleFormChange('isPublished', event.target.checked)}
                        className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      공개 페이지에 노출
                    </label>
                  </div>

                  {formFeedback ? (
                    <p
                      className={`text-sm ${
                        formFeedback.type === 'error' ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {formFeedback.text}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => void resetForm()}
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-blue-400 hover:text-blue-600"
                      disabled={isSaving}
                    >
                      입력 초기화
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                      disabled={isSaving}
                    >
                      {isSaving ? '저장 중…' : formState._id ? '정보 수정' : '정보 등록'}
                    </button>
                  </div>
                </form>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">등록된 심사관</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        데이터베이스에 저장된 카드 목록을 관리합니다.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => void fetchAdminExaminers(adminPassword)}
                        className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-400 hover:text-blue-600"
                      >
                        새로고침
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!adminPassword) return;
                          const confirmed = window.confirm('중복된 심사관 데이터를 삭제하시겠습니까?');
                          if (!confirmed) return;

                          try {
                            const response = await fetch('/api/expert-services/examiners/cleanup', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ password: adminPassword }),
                            });
                            const data = await response.json();
                            if (response.ok) {
                              alert(data.message || '중복 제거 완료');
                              await fetchAdminExaminers(adminPassword);
                            } else {
                              alert(data.message || '중복 제거 실패');
                            }
                          } catch (error) {
                            alert('중복 제거 중 오류가 발생했습니다.');
                          }
                        }}
                        className="inline-flex items-center justify-center rounded-full border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-600 transition hover:border-amber-400 hover:text-amber-700"
                      >
                        중복 제거
                      </button>
                    </div>
                  </div>

                  {isLoadingAdminExaminers ? (
                    <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                      심사관 정보를 불러오는 중…
                    </p>
                  ) : null}

                  {adminListError ? (
                    <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
                      {adminListError}
                    </p>
                  ) : null}

                  {!isLoadingAdminExaminers &&
                  !adminListError &&
                  sortedAdminExaminers.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">
                      등록된 심사관 정보가 없습니다.
                    </p>
                  ) : null}

                  {!isLoadingAdminExaminers && sortedAdminExaminers.length > 0 ? (
                    <div className="relative rounded-xl border border-slate-200 bg-white">
                      <div className="max-h-[500px] overflow-y-auto">
                        <table className="w-full divide-y divide-slate-200 text-sm">
                          <thead className="sticky top-0 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <tr>
                              <th className="whitespace-nowrap px-3 py-2.5">이름</th>
                              <th className="whitespace-nowrap px-3 py-2.5">소속</th>
                              <th className="whitespace-nowrap px-3 py-2.5">분야</th>
                              <th className="whitespace-nowrap px-3 py-2.5 text-center">순서</th>
                              <th className="whitespace-nowrap px-3 py-2.5 text-center">상태</th>
                              <th className="whitespace-nowrap px-3 py-2.5 text-center" aria-label="작업">
                                작업
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                          {sortedAdminExaminers.map((examiner) => {
                            const updatedAt = examiner.updatedAt
                              ? new Date(examiner.updatedAt)
                              : null;
                            const updatedLabel = updatedAt
                              ? updatedAt.toLocaleString('ko-KR', { hour12: false })
                              : '-';
                            const categoryMeta = CATEGORY_OPTIONS.find((option) => option.value === examiner.category);
                            const categoryLabel = categoryMeta?.label ?? (examiner.category || '-');
                            return (
                              <tr
                                key={
                                  examiner._id ??
                                  `${examiner.name}-${examiner.companyName ?? 'unknown'}`
                                }
                              >
                                <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-900">
                                  {examiner.name}
                                </td>
                                <td className="max-w-[150px] truncate px-3 py-2 text-slate-600" title={examiner.companyName ?? ''}>
                                  {examiner.companyName ?? '—'}
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-slate-600">{categoryLabel}</td>
                                <td className="px-3 py-2 text-center text-slate-600">
                                  {typeof examiner.sortOrder === 'number' ? examiner.sortOrder : 0}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  <span
                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                      examiner.isPublished
                                        ? 'bg-emerald-50 text-emerald-600'
                                        : 'bg-slate-100 text-slate-500'
                                    }`}
                                  >
                                    {examiner.isPublished ? '공개' : '비공개'}
                                  </span>
                                </td>
                                <td className="px-3 py-2">
                                  <div className="flex justify-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => void handleEdit(examiner)}
                                      className="rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 transition hover:border-blue-400 hover:text-blue-600"
                                    >
                                      수정
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => void handleDelete(examiner)}
                                      className="rounded border border-rose-300 px-2 py-1 text-xs font-medium text-rose-600 transition hover:border-rose-400"
                                    >
                                      삭제
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {isModalOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
            <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
              <button
                type="button"
                onClick={closeModal}
                className="absolute right-4 top-4 text-slate-400 transition hover:text-slate-600"
                aria-label="닫기"
                disabled={isVerifying}
              >
                <i className="fas fa-times" aria-hidden="true" />
              </button>
              <h3 className="text-lg font-semibold text-slate-900">관리자 접근</h3>
              <p className="mt-2 text-sm text-slate-500">
                인증 기업심사관 카드를 관리하려면 관리자 비밀번호를 입력하세요.
              </p>
              <form className="mt-6 space-y-4" onSubmit={handlePasswordSubmit}>
                <label className="flex flex-col gap-2 text-sm">
                  <span className="font-semibold text-slate-700">비밀번호</span>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(event) => setPasswordInput(event.target.value)}
                    className="rounded-xl border border-slate-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    autoFocus
                  />
                </label>
                {verifyFeedback ? (
                  <p
                    className={`text-sm ${
                      verifyFeedback.type === 'error' ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {verifyFeedback.text}
                  </p>
                ) : null}
                <button
                  type="submit"
                  className="w-full rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                  disabled={isVerifying}
                >
                  {isVerifying ? '확인 중…' : '확인'}
                </button>
              </form>
            </div>
          </div>
        ) : null}
      </section>
    );
  }
);













