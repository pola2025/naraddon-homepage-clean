'use client';

import React, { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './NaraddonTubeAdmin.css';

interface TubeVideo {
  title: string;
  youtubeId: string;
  url: string;
  customThumbnail?: string;
}

interface TubeEntry {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  thumbnailUrl: string;
  videos: TubeVideo[];
  isPublished: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

interface UploadFormState {
  title: string;
  subtitle: string;
  description: string;
  thumbnailUrl: string;
  video1Title: string;
  video1Url: string;
  video2Title: string;
  video2Url: string;
  sortOrder: number;
  isPublished: boolean;
}

type FeedbackState = { type: 'success' | 'error'; text: string } | null;

const initialUploadForm: UploadFormState = {
  title: '',
  subtitle: '',
  description: '',
  thumbnailUrl: '',
  video1Title: '',
  video1Url: '',
  video2Title: '',
  video2Url: '',
  sortOrder: 0,
  isPublished: true,
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

const NaraddonTubeAdminPage: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<FeedbackState>(null);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);

  const [entries, setEntries] = useState<TubeEntry[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);
  const [loadEntriesError, setLoadEntriesError] = useState<string | null>(null);

  const [uploadForm, setUploadForm] = useState<UploadFormState>(initialUploadForm);
  const [formFeedback, setFormFeedback] = useState<FeedbackState>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TubeEntry | null>(null);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);

  const [thumbnailFeedback, setThumbnailFeedback] = useState<FeedbackState>(null);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [pendingThumbnailKey, setPendingThumbnailKey] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formattedEntries = useMemo(
    () => [...entries].sort((a, b) => a.sortOrder - b.sortOrder),
    [entries]
  );

  const fetchEntries = useCallback(async () => {
    try {
      setIsLoadingEntries(true);
      setLoadEntriesError(null);
      const response = await fetch('/api/naraddon-tube?includeDraft=true', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('나라똔튜브 데이터를 불러오지 못했어요.');
      }
      const data = await response.json();
      if (Array.isArray(data?.entries)) {
        setEntries(data.entries as TubeEntry[]);
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.error('[NaraddonTubeAdmin] fetchEntries', error);
      setLoadEntriesError('나라똔튜브 목록을 가져오는 중 문제가 발생했어요.');
      setEntries([]);
    } finally {
      setIsLoadingEntries(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      void fetchEntries();
    }
  }, [isAuthorized, fetchEntries]);

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!passwordInput.trim()) {
      setPasswordFeedback({ type: 'error', text: '비밀번호를 입력해 주세요.' });
      return;
    }

    try {
      setIsVerifyingPassword(true);
      setPasswordFeedback(null);
      const response = await fetch('/api/naraddon-tube/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput.trim() }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setPasswordFeedback({
          type: 'error',
          text: data?.message || '비밀번호가 일치하지 않습니다.',
        });
        return;
      }

      setIsAuthorized(true);
      setAdminPassword(passwordInput.trim());
      setPasswordFeedback({ type: 'success', text: '확인되었습니다.' });
    } catch (error) {
      console.error('[NaraddonTubeAdmin] verify', error);
      setPasswordFeedback({ type: 'error', text: '비밀번호 확인 중 오류가 발생했습니다.' });
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  const updateFormField = useCallback(
    <K extends keyof UploadFormState>(field: K, value: UploadFormState[K]) => {
      setUploadForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const deleteObjectFromR2 = useCallback(
    async (objectKey: string) => {
      if (!adminPassword) {
        return false;
      }

      try {
        const response = await fetch('/api/naraddon-tube/assets/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: adminPassword, objectKey }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.message || '썸네일을 삭제하지 못했습니다.');
        }
        return true;
      } catch (error) {
        console.error('[NaraddonTubeAdmin] deleteObject', error);
        setThumbnailFeedback({
          type: 'error',
          text: error instanceof Error ? error.message : '썸네일 삭제 중 문제가 발생했습니다.',
        });
        return false;
      }
    },
    [adminPassword]
  );

  const resetForm = useCallback(
    async (options?: { preserveThumbnail?: boolean }) => {
      if (!options?.preserveThumbnail && pendingThumbnailKey) {
        await deleteObjectFromR2(pendingThumbnailKey);
      }

      setUploadForm(initialUploadForm);
      setThumbnailFeedback(null);
      setPendingThumbnailKey(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [deleteObjectFromR2, pendingThumbnailKey]
  );

  const uploadThumbnailToR2 = useCallback(
    async (file: File) => {
      if (!adminPassword) {
        setThumbnailFeedback({ type: 'error', text: '비밀번호 확인 후 다시 시도해 주세요.' });
        return;
      }

      setIsUploadingThumbnail(true);
      setThumbnailFeedback(null);

      if (pendingThumbnailKey) {
        await deleteObjectFromR2(pendingThumbnailKey);
        setPendingThumbnailKey(null);
      }

      try {
        const response = await fetch('/api/naraddon-tube/assets/presign', {
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
          throw new Error(data?.message || '썸네일 업로드 URL을 발급받지 못했습니다.');
        }

        const { uploadUrl, objectKey, publicUrl } = data ?? {};
        if (!uploadUrl || !objectKey || !publicUrl) {
          throw new Error('썸네일 업로드 정보가 올바르지 않습니다.');
        }

        const uploadResponse = await fetch(uploadUrl as string, {
          method: 'PUT',
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
          body: file,
        });

        if (!uploadResponse.ok) {
          throw new Error('썸네일 업로드가 실패했습니다.');
        }

        setPendingThumbnailKey(objectKey as string);
        updateFormField('thumbnailUrl', publicUrl as string);
        setThumbnailFeedback({ type: 'success', text: '썸네일 업로드가 완료되었습니다.' });
      } catch (error) {
        setThumbnailFeedback({
          type: 'error',
          text: error instanceof Error ? error.message : '썸네일 업로드 중 문제가 발생했습니다.',
        });
        console.error('[NaraddonTubeAdmin] uploadThumbnail', error);
      } finally {
        setIsUploadingThumbnail(false);
      }
    },
    [adminPassword, deleteObjectFromR2, pendingThumbnailKey, updateFormField]
  );

  const handleThumbnailSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setThumbnailFeedback({ type: 'error', text: '이미지 용량은 5MB 이하만 업로드할 수 있어요.' });
      event.target.value = '';
      return;
    }

    if (file.type && !ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setThumbnailFeedback({ type: 'error', text: 'JPG, PNG, WEBP, AVIF 형식만 지원합니다.' });
      event.target.value = '';
      return;
    }

    await uploadThumbnailToR2(file);
  };

  const clearThumbnailSelection = async () => {
    if (pendingThumbnailKey) {
      await deleteObjectFromR2(pendingThumbnailKey);
    }
    setPendingThumbnailKey(null);
    updateFormField('thumbnailUrl', '');
    setThumbnailFeedback(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEditEntry = (entry: TubeEntry) => {
    setEditingEntry(entry);
    setUploadForm({
      title: entry.title,
      subtitle: entry.subtitle || '',
      description: entry.description || '',
      thumbnailUrl: entry.thumbnailUrl,
      video1Title: entry.videos[0]?.title || '',
      video1Url: entry.videos[0]?.youtubeId || '',
      video2Title: entry.videos[1]?.title || '',
      video2Url: entry.videos[1]?.youtubeId || '',
      sortOrder: entry.sortOrder,
      isPublished: entry.isPublished,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('정말로 이 카드를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    setDeletingEntryId(entryId);
    try {
      const response = await fetch('/api/naraddon-tube/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword, entryId }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || '카드를 삭제하지 못했습니다.');
      }

      setFormFeedback({ type: 'success', text: '카드가 삭제되었습니다.' });
      await fetchEntries();
    } catch (error) {
      console.error('[NaraddonTubeAdmin] delete', error);
      setFormFeedback({
        type: 'error',
        text: error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.',
      });
    } finally {
      setDeletingEntryId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
    resetForm();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!adminPassword) {
      setFormFeedback({ type: 'error', text: '비밀번호 확인 후 다시 시도해 주세요.' });
      return;
    }

    const trimmedTitle = uploadForm.title.trim();
    const trimmedThumbnail = uploadForm.thumbnailUrl.trim();
    const video1 = uploadForm.video1Url.trim();
    const video2 = uploadForm.video2Url.trim();

    if (!trimmedTitle) {
      setFormFeedback({ type: 'error', text: '카드 제목을 입력해 주세요.' });
      return;
    }

    if (!trimmedThumbnail) {
      setFormFeedback({ type: 'error', text: '썸네일을 업로드해 주세요.' });
      return;
    }

    // 영상 링크는 선택적 - 없어도 등록 가능

    try {
      setIsSaving(true);
      setFormFeedback(null);

      if (editingEntry) {
        // 수정 모드
        const response = await fetch('/api/naraddon-tube/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            password: adminPassword,
            entryId: editingEntry._id,
            title: trimmedTitle,
            subtitle: uploadForm.subtitle.trim(),
            description: uploadForm.description.trim(),
            thumbnailUrl: trimmedThumbnail,
            oldThumbnailUrl: editingEntry.thumbnailUrl,
            sortOrder: Number.isFinite(uploadForm.sortOrder) ? uploadForm.sortOrder : 0,
            isPublished: uploadForm.isPublished,
            videos: [
              ...(video1 ? [{ title: uploadForm.video1Title.trim(), youtubeUrl: video1 }] : []),
              ...(video2 ? [{ title: uploadForm.video2Title.trim(), youtubeUrl: video2 }] : []),
            ],
          }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message || '수정에 실패했습니다.');
        }

        setFormFeedback({ type: 'success', text: '수정이 완료되었습니다.' });
        setEditingEntry(null);
      } else {
        // 등록 모드
        const response = await fetch('/api/naraddon-tube', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            password: adminPassword,
            title: trimmedTitle,
            subtitle: uploadForm.subtitle.trim(),
            description: uploadForm.description.trim(),
            thumbnailUrl: trimmedThumbnail,
            sortOrder: Number.isFinite(uploadForm.sortOrder) ? uploadForm.sortOrder : 0,
            isPublished: uploadForm.isPublished,
            videos: [
              ...(video1 ? [{ title: uploadForm.video1Title.trim(), youtubeUrl: video1 }] : []),
              ...(video2 ? [{ title: uploadForm.video2Title.trim(), youtubeUrl: video2 }] : []),
            ],
          }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message || '콘텐츠 생성에 실패했습니다.');
        }

        setFormFeedback({ type: 'success', text: '등록이 완료되었습니다.' });
      }

      setPendingThumbnailKey(null);
      await fetchEntries();
      await resetForm({ preserveThumbnail: true });
    } catch (error) {
      console.error('[NaraddonTubeAdmin] save', error);
      setFormFeedback({
        type: 'error',
        text: error instanceof Error ? error.message : '작업 중 오류가 발생했습니다.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualRefresh = async () => {
    await fetchEntries();
    setFormFeedback(null);
  };

  return (
    <div className="tube-admin-page">
      <div className="tube-admin-container">
        <section className="tube-admin-card">
          <h1 className="tube-admin-title">나라똔튜브 업로드 보드</h1>
          <p className="tube-admin-subtitle">
            관리자 전용 페이지입니다. 비밀번호를 확인하면 썸네일 업로드와 영상 등록을 진행할 수
            있어요.
          </p>

          {!isAuthorized && (
            <form className="tube-admin-password-form" onSubmit={handlePasswordSubmit}>
              <div className="tube-admin-field-group">
                <label className="tube-admin-label" htmlFor="naraddon-tube-admin-password">
                  관리자 비밀번호
                </label>
                <input
                  id="naraddon-tube-admin-password"
                  type="password"
                  className="tube-admin-input"
                  value={passwordInput}
                  onChange={(event) => setPasswordInput(event.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              {passwordFeedback && (
                <p
                  className={`tube-admin-feedback ${
                    passwordFeedback.type === 'error'
                      ? 'tube-admin-feedback--error'
                      : 'tube-admin-feedback--success'
                  }`}
                >
                  {passwordFeedback.text}
                </p>
              )}

              <button className="tube-admin-button" type="submit" disabled={isVerifyingPassword}>
                {isVerifyingPassword ? '확인 중...' : '비밀번호 확인'}
              </button>
            </form>
          )}
        </section>

        {isAuthorized && (
          <>
            <section className="tube-admin-card tube-admin-card--compact">
              <div className="tube-admin-board">
                <header>
                  <h2 className="tube-admin-title">
                    {editingEntry ? '나라똔튜브 카드 수정' : '새로운 나라똔튜브 카드 등록'}
                  </h2>
                  <p className="tube-admin-subtitle">
                    {editingEntry
                      ? '수정할 내용을 변경한 후 수정하기 버튼을 눌러 주세요.'
                      : '썸네일을 업로드하고 영상 링크 두 개를 입력한 뒤 등록 버튼을 눌러 주세요.'}
                  </p>
                  {editingEntry && (
                    <button
                      type="button"
                      className="tube-admin-secondary-button"
                      onClick={handleCancelEdit}
                      style={{ marginTop: '8px' }}
                    >
                      수정 취소
                    </button>
                  )}
                </header>

                <form onSubmit={handleSubmit} className="tube-admin-board">
                  <div className="tube-admin-form-grid">
                    <div className="tube-admin-field-group">
                      <label className="tube-admin-label" htmlFor="tube-card-title">
                        카드 제목
                      </label>
                      <input
                        id="tube-card-title"
                        className="tube-admin-input"
                        value={uploadForm.title}
                        onChange={(event) => updateFormField('title', event.target.value)}
                        required
                      />
                    </div>

                    <div className="tube-admin-field-group">
                      <label className="tube-admin-label" htmlFor="tube-card-subtitle">
                        서브 타이틀 (선택)
                      </label>
                      <input
                        id="tube-card-subtitle"
                        className="tube-admin-input"
                        value={uploadForm.subtitle}
                        onChange={(event) => updateFormField('subtitle', event.target.value)}
                      />
                    </div>

                    <div className="tube-admin-field-group">
                      <label className="tube-admin-label" htmlFor="tube-card-description">
                        설명 (선택)
                      </label>
                      <textarea
                        id="tube-card-description"
                        className="tube-admin-input tube-admin-textarea"
                        value={uploadForm.description}
                        onChange={(event) => updateFormField('description', event.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="tube-admin-field-group">
                      <label className="tube-admin-label" htmlFor="tube-card-sort">
                        노출 우선순위 (숫자가 낮을수록 먼저 노출)
                      </label>
                      <input
                        id="tube-card-sort"
                        type="number"
                        className="tube-admin-input"
                        value={uploadForm.sortOrder}
                        min={0}
                        onChange={(event) =>
                          updateFormField('sortOrder', Number(event.target.value))
                        }
                      />
                    </div>

                    <div className="tube-admin-field-group">
                      <label className="tube-admin-label">공개 상태</label>
                      <label
                        className="tube-admin-secondary-button"
                        style={{ justifyContent: 'space-between' }}
                      >
                        <span>{uploadForm.isPublished ? '바로 공개' : '임시 저장'}</span>
                        <input
                          type="checkbox"
                          checked={uploadForm.isPublished}
                          onChange={(event) => updateFormField('isPublished', event.target.checked)}
                          style={{ marginLeft: '12px' }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="tube-admin-upload-box">
                    <div className="tube-admin-field-group">
                      <label className="tube-admin-label" htmlFor="tube-thumbnail">
                        썸네일 이미지 업로드
                      </label>
                      <input
                        id="tube-thumbnail"
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleThumbnailSelect}
                        className="tube-admin-input"
                      />
                    </div>

                    <div className="tube-admin-upload-actions">
                      <button
                        type="button"
                        className="tube-admin-secondary-button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingThumbnail}
                      >
                        {isUploadingThumbnail ? '업로드 중...' : '이미지 선택'}
                      </button>

                      <button
                        type="button"
                        className="tube-admin-secondary-button"
                        onClick={() => void clearThumbnailSelection()}
                        disabled={isUploadingThumbnail || !uploadForm.thumbnailUrl}
                      >
                        썸네일 초기화
                      </button>
                    </div>

                    {uploadForm.thumbnailUrl && (
                      <div className="tube-admin-preview">
                        <img src={uploadForm.thumbnailUrl} alt="나라똔튜브 썸네일 미리보기" />
                      </div>
                    )}

                    {thumbnailFeedback && (
                      <p
                        className={`tube-admin-feedback ${
                          thumbnailFeedback.type === 'error'
                            ? 'tube-admin-feedback--error'
                            : 'tube-admin-feedback--success'
                        }`}
                      >
                        {thumbnailFeedback.text}
                      </p>
                    )}
                  </div>

                  <div className="tube-admin-form-grid">
                    <div className="tube-admin-field-group">
                      <label className="tube-admin-label" htmlFor="tube-video-1-title">
                        영상 1 제목 (선택)
                      </label>
                      <input
                        id="tube-video-1-title"
                        className="tube-admin-input"
                        value={uploadForm.video1Title}
                        onChange={(event) => updateFormField('video1Title', event.target.value)}
                      />
                    </div>

                    <div className="tube-admin-field-group">
                      <label className="tube-admin-label" htmlFor="tube-video-1-url">
                        영상 1 YouTube 링크 또는 ID (선택)
                      </label>
                      <input
                        id="tube-video-1-url"
                        className="tube-admin-input"
                        value={uploadForm.video1Url}
                        onChange={(event) => updateFormField('video1Url', event.target.value)}
                        placeholder="영상 준비 중인 경우 비워두세요"
                      />
                    </div>

                    <div className="tube-admin-field-group">
                      <label className="tube-admin-label" htmlFor="tube-video-2-title">
                        영상 2 제목 (선택)
                      </label>
                      <input
                        id="tube-video-2-title"
                        className="tube-admin-input"
                        value={uploadForm.video2Title}
                        onChange={(event) => updateFormField('video2Title', event.target.value)}
                      />
                    </div>

                    <div className="tube-admin-field-group">
                      <label className="tube-admin-label" htmlFor="tube-video-2-url">
                        영상 2 YouTube 링크 또는 ID (선택)
                      </label>
                      <input
                        id="tube-video-2-url"
                        className="tube-admin-input"
                        value={uploadForm.video2Url}
                        onChange={(event) => updateFormField('video2Url', event.target.value)}
                        placeholder="영상 준비 중인 경우 비워두세요"
                      />
                    </div>
                  </div>

                  {formFeedback && (
                    <p
                      className={`tube-admin-feedback ${
                        formFeedback.type === 'error'
                          ? 'tube-admin-feedback--error'
                          : 'tube-admin-feedback--success'
                      }`}
                    >
                      {formFeedback.text}
                    </p>
                  )}

                  <div className="tube-admin-actions">
                    <button
                      type="button"
                      className="tube-admin-secondary-button"
                      onClick={() => void resetForm()}
                      disabled={isSaving || isUploadingThumbnail}
                    >
                      입력 초기화
                    </button>
                    <button type="submit" className="tube-admin-button" disabled={isSaving}>
                      {isSaving ? '처리 중...' : editingEntry ? '수정하기' : '등록하기'}
                    </button>
                  </div>
                </form>
              </div>
            </section>

            <section className="tube-admin-card tube-admin-card--compact">
              <header className="tube-admin-actions" style={{ justifyContent: 'space-between' }}>
                <div>
                  <h2 className="tube-admin-title">등록된 카드 현황</h2>
                  <p className="tube-admin-subtitle">
                    최신 순으로 정렬하려면 우선순위를 조정해 주세요. 임시 저장 상태는 회색 뱃지로
                    표시됩니다.
                  </p>
                </div>
                <button
                  type="button"
                  className="tube-admin-secondary-button"
                  onClick={() => void handleManualRefresh()}
                >
                  새로고침
                </button>
              </header>

              {isLoadingEntries && <p>목록을 불러오는 중입니다...</p>}
              {loadEntriesError && (
                <p className="tube-admin-feedback tube-admin-feedback--error">{loadEntriesError}</p>
              )}

              {!isLoadingEntries && !formattedEntries.length && !loadEntriesError && (
                <p className="tube-admin-empty">아직 등록된 카드가 없습니다.</p>
              )}

              {!isLoadingEntries && formattedEntries.length > 0 && (
                <div style={{ overflowX: 'auto' }}>
                  <table className="tube-admin-table">
                    <thead>
                      <tr>
                        <th>제목</th>
                        <th>우선순위</th>
                        <th>공개</th>
                        <th>등록일</th>
                        <th>영상 수</th>
                        <th>작업</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formattedEntries.map((entry) => {
                        const created = entry.createdAt ? new Date(entry.createdAt) : null;
                        const formattedDate = created
                          ? created.toLocaleString('ko-KR', { hour12: false })
                          : '-';
                        return (
                          <tr key={entry._id}>
                            <td>{entry.title}</td>
                            <td>{entry.sortOrder}</td>
                            <td>
                              <span
                                className={`tube-admin-status-badge ${
                                  entry.isPublished ? '' : 'tube-admin-status-badge--draft'
                                }`}
                              >
                                {entry.isPublished ? '공개' : '임시'}
                              </span>
                            </td>
                            <td>{formattedDate}</td>
                            <td>{entry.videos?.length ?? 0}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  type="button"
                                  className="tube-admin-action-button tube-admin-action-button--edit"
                                  onClick={() => handleEditEntry(entry)}
                                  disabled={isSaving || isUploadingThumbnail}
                                >
                                  수정
                                </button>
                                <button
                                  type="button"
                                  className="tube-admin-action-button tube-admin-action-button--delete"
                                  onClick={() => handleDeleteEntry(entry._id)}
                                  disabled={isSaving || isUploadingThumbnail || deletingEntryId === entry._id}
                                >
                                  {deletingEntryId === entry._id ? '삭제 중...' : '삭제'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default NaraddonTubeAdminPage;
