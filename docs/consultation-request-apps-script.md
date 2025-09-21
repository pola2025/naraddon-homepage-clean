# Google Apps Script – 상담신청 웹훅

아래 코드를 새 Google Apps Script 프로젝트에 붙여 넣은 뒤 **웹 앱(Web App)** 으로 배포하세요. 스크립트 속성(Properties)에는 다음 값을 설정하면 됩니다.

| 속성 키 | 설명 |
| --- | --- |
| `SPREADSHEET_ID` | 상담 데이터를 적재할 스프레드시트 ID (`1s1F6yw3ioJv1_pzI_OKG1u_st1S2pGRc99jqsUQbnIw`) |
| `TARGET_SHEET_NAME` | (선택) 사용할 시트 이름. 지정하지 않으면 첫 번째 시트를 사용 |
| `NOTIFICATION_EMAILS` | 이메일 수신자 목록. 쉼표로 구분 (예: `imjoo@jjk-biz.com,ijy@jjk-biz.com,syj@jjk-biz.com,mkt9834@gmail.com`) |
| `WEBHOOK_SECRET` | 서버와 Apps Script가 공유하는 보안 키 (필수) |
| `TELEGRAM_BOT_TOKEN` | 텔레그램 봇 토큰 (선택, 서버에서 전달되는 경우 생략 가능) |
| `TELEGRAM_CHAT_ID` | 텔레그램 채팅 ID (선택) |
| `NAVER_SENS_ENABLED` | `true` 혹은 `false` (기본 `false`) |
| `NAVER_SENS_SERVICE_ID` | SENS 서비스 ID (선택) |
| `NAVER_SENS_ACCESS_KEY` | SENS Access Key (선택) |
| `NAVER_SENS_SECRET_KEY` | SENS Secret Key (선택) |
| `NAVER_SENS_SENDER_NUMBER` | 발신 번호 (선택) |

> **참고**: 서버(`/api/consultation/quick-submit`)에서 토큰·이메일 값이 JSON payload에 포함되어 오면 해당 값을 우선 사용하고, 없을 경우 위 스크립트 속성을 fallback으로 참조합니다.
> **웹 앱 URL**: https://script.google.com/macros/s/AKfycbyzrH3BgdAyqyqw-Mzk013BGkCAZEPnej_Jd7DpN_0g-hKP8qJH85aEdCFlSHxRY3ybZQ/exec

```gs
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('빈 요청입니다.');
    }

    const payload = JSON.parse(e.postData.contents);

    if (!isAuthorized(payload)) {
      Logger.log('[consultation-webhook] invalid secret');
      return jsonResponse({ ok: false, message: 'Unauthorized request' }, 401);
    }

    const submission = payload.submission || {};
    const submittedAtIso = payload.submittedAt || new Date().toISOString();
    const submittedAtText = formatKstDate(submittedAtIso);

    appendToSpreadsheet(submission, submittedAtText);

    const meta = payload.meta || {};
    const notification = payload.notification || {};

    const summaryText = buildSummaryText(submission, submittedAtText);
    const emailBody = buildEmailBody(submission, submittedAtText, meta);
    const smsBody = buildSmsContent(submission, submittedAtText);

    dispatchEmails(notification, summaryText, emailBody);
    dispatchTelegram(notification, summaryText);
    dispatchSensSms(notification, submission.phone, smsBody);

    return jsonResponse({ ok: true });
  } catch (error) {
    Logger.log('[consultation-webhook] 오류: ' + (error.stack || error));
    return jsonResponse({ ok: false, message: error.message || String(error) }, 500);
  }
}

function isAuthorized(payload) {
  const expectedSecret = getScriptProperty('WEBHOOK_SECRET');
  if (!expectedSecret) {
    return true;
  }

  const providedSecret =
    payload && payload.auth && typeof payload.auth.secret === 'string' ? payload.auth.secret.trim() : '';

  return providedSecret && providedSecret === expectedSecret;
}

function appendToSpreadsheet(submission, submittedAtText) {
  const spreadsheetId = getScriptProperty('SPREADSHEET_ID');
  if (!spreadsheetId) {
    throw new Error('SPREADSHEET_ID 속성이 설정되어 있지 않습니다.');
  }

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheetName = getScriptProperty('TARGET_SHEET_NAME');
  const sheet = sheetName ? spreadsheet.getSheetByName(sheetName) : spreadsheet.getSheets()[0];

  if (!sheet) {
    throw new Error('대상 시트를 찾을 수 없습니다.');
  }

  const row = [
    submittedAtText,
    submission.region || '',
    submission.businessNumber || '',
    submission.name || '',
    submission.phone || '',
    submission.email || '',
    submission.consultType || '',
    submission.annualRevenue || '',
    submission.employeeCount || '',
    submission.desiredTime || '',
    submission.preferredTime || '',
    submission.message || '',
    submission.privacyConsent ? '동의' : '미동의',
    submission.marketingConsent ? '동의' : '미동의',
  ];

  sheet.appendRow(row);
}

function dispatchEmails(notification, summaryText, htmlBody) {
  const recipients = resolveEmailRecipients(notification);
  if (!recipients.length) {
    return;
  }

  const subject = '[나라돈] 신규 상담 신청 알림';
  MailApp.sendEmail({
    to: recipients.join(','),
    subject,
    htmlBody,
    name: '나라돈 상담센터',
  });
}

function dispatchTelegram(notification, summaryText) {
  const config = resolveTelegramConfig(notification);
  if (!config.enabled) {
    return;
  }

  const url = 'https://api.telegram.org/bot' + config.botToken + '/sendMessage';
  const payload = {
    chat_id: config.chatId,
    text: summaryText,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  };

  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  if (response.getResponseCode() >= 300) {
    Logger.log('[consultation-webhook] Telegram 전송 실패: ' + response.getContentText());
  }
}

function dispatchSensSms(notification, recipientPhone, smsBody) {
  const config = resolveSensConfig(notification);
  if (!config.enabled) {
    return;
  }

  if (!recipientPhone) {
    Logger.log('[consultation-webhook] SENS 전송 실패: 수신 번호가 없습니다.');
    return;
  }

  if (!config.serviceId || !config.accessKey || !config.secretKey || !config.senderNumber) {
    Logger.log('[consultation-webhook] SENS 설정이 완전하지 않아 전송하지 않습니다.');
    return;
  }

  try {
    const sanitizedRecipient = recipientPhone.replace(/[^0-9]/g, '');
    const urlPath = '/sms/v2/services/' + config.serviceId + '/messages';
    const endpoint = 'https://sens.apigw.ntruss.com' + urlPath;
    const timestamp = Date.now().toString();

    const signature = Utilities.computeHmacSha256Signature(
      'POST ' + urlPath + '\n' + timestamp + '\n' + config.accessKey,
      config.secretKey
    );
    const signatureBase64 = Utilities.base64Encode(signature);

    const payload = {
      type: 'SMS',
      contentType: 'COMM',
      countryCode: '82',
      from: config.senderNumber,
      content: smsBody,
      messages: [{ to: sanitizedRecipient }],
    };

    const options = {
      method: 'post',
      contentType: 'application/json; charset=utf-8',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
      headers: {
        'x-ncp-apigw-timestamp': timestamp,
        'x-ncp-iam-access-key': config.accessKey,
        'x-ncp-apigw-signature-v2': signatureBase64,
      },
    };

    const response = UrlFetchApp.fetch(endpoint, options);
    if (response.getResponseCode() >= 300) {
      Logger.log('[consultation-webhook] SENS 전송 실패: ' + response.getContentText());
    }
  } catch (error) {
    Logger.log('[consultation-webhook] SENS 전송 오류: ' + (error.stack || error));
  }
}

function resolveEmailRecipients(notification) {
  if (notification && notification.emails && notification.emails.length) {
    return notification.emails;
  }
  return getPropertyList('NOTIFICATION_EMAILS');
}

function resolveTelegramConfig(notification) {
  const raw = (notification && notification.telegram) || {};
  const token = raw.botToken || getScriptProperty('TELEGRAM_BOT_TOKEN');
  const chatId = raw.chatId || getScriptProperty('TELEGRAM_CHAT_ID');
  const enabled =
    typeof raw.enabled === 'boolean'
      ? raw.enabled
      : Boolean(token && chatId);

  return { enabled, botToken: token, chatId: chatId };
}

function resolveSensConfig(notification) {
  const raw = (notification && notification.sms) || {};
  const enabled =
    typeof raw.enabled === 'boolean'
      ? raw.enabled
      : getScriptProperty('NAVER_SENS_ENABLED').toLowerCase() === 'true';

  return {
    enabled,
    serviceId: raw.serviceId || getScriptProperty('NAVER_SENS_SERVICE_ID'),
    accessKey: raw.accessKey || getScriptProperty('NAVER_SENS_ACCESS_KEY'),
    secretKey: raw.secretKey || getScriptProperty('NAVER_SENS_SECRET_KEY'),
    senderNumber: raw.senderNumber || getScriptProperty('NAVER_SENS_SENDER_NUMBER'),
  };
}

function buildSummaryText(submission, submittedAtText) {
  const lines = [
    '📨 신규 상담 신청',
    '• 접수시각: ' + submittedAtText,
    '• 이름/회사명: ' + (submission.name || '-'),
    '• 연락처: ' + (submission.phone || '-'),
    '• 지역: ' + (submission.region || '-'),
    '• 상담희망분야: ' + (submission.consultType || '-'),
    '• 상담희망시간: ' + (submission.desiredTime || '-') + ' (' + (submission.preferredTime || '-') + ')',
  ];

  if (submission.message) {
    lines.push('• 문의사항: ' + submission.message);
  }

  return lines.join('\n');
}

function buildEmailBody(submission, submittedAtText, meta) {
  const rows = [
    ['접수시각', submittedAtText],
    ['이름/회사명', submission.name || '-'],
    ['연락처', submission.phone || '-'],
    ['지역', submission.region || '-'],
    ['상담희망분야', submission.consultType || '-'],
    ['희망 상담 시간', submission.desiredTime || '-'],
    ['상담 희망 시기', submission.preferredTime || '-'],
    ['연매출', submission.annualRevenue || '-'],
    ['직원 수', submission.employeeCount || '-'],
    ['사업자번호', submission.businessNumber || '-'],
    ['이메일', submission.email || '-'],
    ['개인정보 수집 동의', submission.privacyConsent ? '동의' : '미동의'],
    ['마케팅 수신 동의', submission.marketingConsent ? '동의' : '미동의'],
  ];

  if (submission.message) {
    rows.push(['문의사항', submission.message]);
  }

  if (meta) {
    if (meta.ip || meta.forwardedFor) {
      rows.push(['요청 IP', meta.forwardedFor || meta.ip || '-']);
    }
    if (meta.userAgent) {
      rows.push(['User-Agent', meta.userAgent]);
    }
    if (meta.referer) {
      rows.push(['Referer', meta.referer]);
    }
  }

  const tableRows = rows
    .map(function (row) {
      return (
        '<tr>' +
        '<th style="padding:8px 12px;text-align:left;background:#0f172a;color:#fff;border-bottom:1px solid #e2e8f0;">' +
        row[0] +
        '</th>' +
        '<td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">' +
        sanitizeHtml(row[1]) +
        '</td>' +
        '</tr>'
      );
    })
    .join('');

  return (
    '<div style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;color:#0f172a;">' +
    '<h2 style="margin:0 0 16px;font-size:18px;">신규 상담 신청이 접수되었습니다.</h2>' +
    '<table style="border-collapse:collapse;min-width:360px;">' +
    tableRows +
    '</table>' +
    '<p style="margin-top:16px;color:#475569;">본 메일은 자동 발송되었습니다.</p>' +
    '</div>'
  );
}

function buildSmsContent(submission, submittedAtText) {
  var message =
    '나라돈 상담신청\n' +
    '접수:' + submittedAtText + '\n' +
    '이름:' + (submission.name || '-') + '\n' +
    '연락:' + (submission.phone || '-') + '\n' +
    '분야:' + (submission.consultType || '-') + '\n' +
    '시간:' + (submission.desiredTime || '-') + ' (' + (submission.preferredTime || '-') + ')';

  if (submission.message) {
    message += '\n문의:' + submission.message;
  }

  if (message.length > 120) {
    message = message.substring(0, 117) + '...';
  }

  return message;
}

function formatKstDate(isoString) {
  var date = new Date(isoString);
  return Utilities.formatDate(date, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
}

function sanitizeHtml(value) {
  if (typeof value !== 'string') {
    value = String(value || '');
  }
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '<br />');
}

function jsonResponse(payload, status) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON)
    .setResponseCode(status || 200);
}

function getScriptProperty(key, defaultValue) {
  var value = PropertiesService.getScriptProperties().getProperty(key);
  if (value == null) {
    return defaultValue || '';
  }
  return value;
}

function getPropertyList(key) {
  var raw = getScriptProperty(key, '');
  if (!raw) {
    return [];
  }
  return raw
    .split(',')
    .map(function (item) {
      return item.trim();
    })
    .filter(function (item) {
      return item.length > 0;
    });
}
```

