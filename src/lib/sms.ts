import axios from 'axios'

function isDevFallbackEnabled(): boolean {
  return process.env.NODE_ENV === 'development' || process.env.SMS_DEV_FALLBACK === 'true'
}

export type SendOtpResult = {
  sent: boolean
  devFallback?: boolean
}

export async function sendOtpSms(phone: string, code: string): Promise<SendOtpResult> {
  const apiKey = process.env.SMS_IR_API_KEY
  const templateId = process.env.SMS_IR_TEMPLATE_ID

  if (!apiKey || !templateId) {
    if (isDevFallbackEnabled()) {
      console.log(`[SMS DEV] OTP for ${phone}: ${code}`)
      return { sent: false, devFallback: true }
    }
    throw new Error('SMS_IR_API_KEY or SMS_IR_TEMPLATE_ID is not configured')
  }

  try {
    const response = await axios.post(
      'https://api.sms.ir/v1/send/verify',
      {
        mobile: phone,
        templateId: Number(templateId),
        parameters: [{ name: 'CODE', value: code }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'x-api-key': apiKey,
        },
        timeout: 15000,
      },
    )

    const status = response.data?.status
    if (status !== undefined && status !== 1 && status !== true) {
      const message = response.data?.message || 'SMS provider rejected the request'
      throw new Error(message)
    }

    return { sent: true }
  } catch (err) {
    if (isDevFallbackEnabled()) {
      console.error('[SMS] send failed, using dev fallback:', err)
      console.log(`[SMS DEV FALLBACK] OTP for ${phone}: ${code}`)
      return { sent: false, devFallback: true }
    }

    if (axios.isAxiosError(err)) {
      if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
        throw new Error('اتصال به سرویس پیامک برقرار نشد. اینترنت یا DNS را بررسی کنید.')
      }
    }

    throw err
  }
}

/**
 * پیامک تأیید پرداخت موفق. خطای پیامک نباید جریان پرداخت را خراب کند،
 * بنابراین این تابع هرگز throw نمی‌کند.
 */
export async function sendPaymentConfirmationSms(
  phone: string,
  params: { amount: string; trackingCode: string },
): Promise<SendOtpResult> {
  const apiKey = process.env.SMS_IR_API_KEY
  const templateId = process.env.SMS_IR_PAYMENT_TEMPLATE_ID

  if (!apiKey || !templateId) {
    if (isDevFallbackEnabled()) {
      console.log(
        `[SMS DEV] Payment confirmation for ${phone}: amount=${params.amount}, tracking=${params.trackingCode}`,
      )
    }
    return { sent: false, devFallback: true }
  }

  try {
    const response = await axios.post(
      'https://api.sms.ir/v1/send/verify',
      {
        mobile: phone,
        templateId: Number(templateId),
        parameters: [
          { name: 'AMOUNT', value: params.amount },
          { name: 'CODE', value: params.trackingCode },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'x-api-key': apiKey,
        },
        timeout: 15000,
      },
    )

    const status = response.data?.status
    if (status !== undefined && status !== 1 && status !== true) {
      console.error('[SMS] payment confirmation rejected:', response.data?.message)
      return { sent: false }
    }

    return { sent: true }
  } catch (err) {
    console.error('[SMS] payment confirmation failed:', err)
    return { sent: false }
  }
}
