export type TEnv = {
  apiBaseUrl: string | undefined
  emailId: string | undefined
}

export const env: TEnv = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || undefined,
  emailId: process.env.NEXT_PUBLIC_EMAIL_ID || undefined,
}
