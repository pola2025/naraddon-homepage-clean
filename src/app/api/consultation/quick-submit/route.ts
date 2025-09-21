import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/lib/mongodb';
import ConsultationRequest from '@/models/ConsultationRequest';
import {
  type ConsultationSubmissionInput,
  validateConsultationSubmission,
} from '@/lib/validation/consultationSubmission';

const GOOGLE_APPS_SCRIPT_WEBHOOK_URL = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;
const CONSULTATION_NOTIFICATION_EMAILS = process.env.CONSULTATION_NOTIFICATION_EMAILS ?? '';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID ?? '';
const CONSULTATION_WEBHOOK_SECRET = process.env.CONSULTATION_WEBHOOK_SECRET ?? '';
const NAVER_SENS_ENABLED = process.env.NAVER_SENS_ENABLED === 'true';
const NAVER_SENS_SERVICE_ID = process.env.NAVER_SENS_SERVICE_ID ?? '';
const NAVER_SENS_ACCESS_KEY = process.env.NAVER_SENS_ACCESS_KEY ?? '';
const NAVER_SENS_SECRET_KEY = process.env.NAVER_SENS_SECRET_KEY ?? '';
const NAVER_SENS_SENDER_NUMBER = process.env.NAVER_SENS_SENDER_NUMBER ?? '';

function parseEmailList(raw: string): string[] {
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export async function POST(request: NextRequest) {
  let payload: ConsultationSubmissionInput;
  try {
    payload = (await request.json()) as ConsultationSubmissionInput;
  } catch (error) {
    console.error('[consultation] invalid JSON payload', error);
    return NextResponse.json({ message: '잘못된 요청 형식입니다.' }, { status: 400 });
  }

  const { data, errors } = validateConsultationSubmission(payload);
  if (!data) {
    return NextResponse.json(
      {
        message: '입력값을 다시 확인해 주세요.',
        errors,
      },
      { status: 400 }
    );
  }

  const submittedAt = new Date();
  const meta = {
    ip: request.ip ?? '',
    forwardedFor: request.headers.get('x-forwarded-for') ?? '',
    userAgent: request.headers.get('user-agent') ?? '',
    referer: request.headers.get('referer') ?? '',
  };

  try {
    await connectDB();
  } catch (error) {
    console.error('[consultation] database connection error', error);
    return NextResponse.json(
      { message: '데이터베이스 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 500 }
    );
  }

  try {
    await ConsultationRequest.create({
      ...data,
      meta,
    });
  } catch (error) {
    console.error('[consultation] failed to persist submission', error);
    return NextResponse.json(
      { message: '신청 정보를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 500 }
    );
  }

  let notificationsForwarded = false;
  let notificationError: string | undefined;

  if (GOOGLE_APPS_SCRIPT_WEBHOOK_URL) {
    const payloadForAppsScript: Record<string, unknown> = {
      submission: data,
      submittedAt: submittedAt.toISOString(),
      meta,
      notification: {
        emails: parseEmailList(CONSULTATION_NOTIFICATION_EMAILS),
        telegram: {
          enabled: Boolean(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID),
          botToken: TELEGRAM_BOT_TOKEN,
          chatId: TELEGRAM_CHAT_ID,
        },
        sms: {
          enabled: NAVER_SENS_ENABLED,
          serviceId: NAVER_SENS_SERVICE_ID,
          accessKey: NAVER_SENS_ACCESS_KEY,
          secretKey: NAVER_SENS_SECRET_KEY,
          senderNumber: NAVER_SENS_SENDER_NUMBER,
        },
      },
    };

    if (CONSULTATION_WEBHOOK_SECRET) {
      (payloadForAppsScript as { auth?: { secret: string } }).auth = {
        secret: CONSULTATION_WEBHOOK_SECRET,
      };
    }

    try {
      const response = await fetch(GOOGLE_APPS_SCRIPT_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        body: JSON.stringify(payloadForAppsScript),
      });

      if (!response.ok) {
        notificationError = `Apps Script 응답 오류 (status: ${response.status})`;
      } else {
        notificationsForwarded = true;
      }
    } catch (error) {
      notificationError =
        error instanceof Error ? error.message : 'Apps Script 전송 중 알 수 없는 오류가 발생했습니다.';
    }
  } else {
    notificationError = 'GOOGLE_APPS_SCRIPT_WEBHOOK_URL 환경변수가 설정되지 않았습니다.';
  }

  if (notificationError) {
    console.error('[consultation] notification forwarding issue:', notificationError);
  }

  return NextResponse.json(
    {
      success: true,
      notificationsForwarded,
      notificationError: notificationsForwarded ? undefined : notificationError,
    },
    { status: notificationError ? 202 : 200 }
  );
}
