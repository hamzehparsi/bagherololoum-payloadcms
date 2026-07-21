import axios from 'axios'

const ZARINPAL_REQUEST_URL = 'https://api.zarinpal.com/pg/v4/payment/request.json'
const ZARINPAL_VERIFY_URL = 'https://api.zarinpal.com/pg/v4/payment/verify.json'
const ZARINPAL_START_URL = 'https://www.zarinpal.com/pg/StartPay'

export function isZarinpalConfigured(): boolean {
  return Boolean(process.env.ZARINPAL_MERCHANT_ID)
}

export async function requestZarinpalPayment(params: {
  amount: number
  description: string
  callbackUrl: string
  mobile?: string
}): Promise<{ authority: string; paymentUrl: string }> {
  const merchantId = process.env.ZARINPAL_MERCHANT_ID
  if (!merchantId) {
    throw new Error('ZARINPAL_MERCHANT_ID is not configured')
  }

  const response = await axios.post(ZARINPAL_REQUEST_URL, {
    merchant_id: merchantId,
    amount: params.amount,
    description: params.description,
    callback_url: params.callbackUrl,
    metadata: params.mobile ? { mobile: params.mobile } : undefined,
  })

  const data = response.data?.data
  if (data?.code !== 100 || !data?.authority) {
    throw new Error(data?.message || 'Zarinpal request failed')
  }

  return {
    authority: data.authority as string,
    paymentUrl: `${ZARINPAL_START_URL}/${data.authority}`,
  }
}

export async function verifyZarinpalPayment(params: {
  authority: string
  amount: number
}): Promise<{ refId: number }> {
  const merchantId = process.env.ZARINPAL_MERCHANT_ID
  if (!merchantId) {
    throw new Error('ZARINPAL_MERCHANT_ID is not configured')
  }

  const response = await axios.post(ZARINPAL_VERIFY_URL, {
    merchant_id: merchantId,
    amount: params.amount,
    authority: params.authority,
  })

  const data = response.data?.data
  if (data?.code !== 100 && data?.code !== 101) {
    throw new Error(data?.message || 'Zarinpal verify failed')
  }

  return { refId: data.ref_id as number }
}
