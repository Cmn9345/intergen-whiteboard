import { GoogleAuth } from 'google-auth-library';

// Google Cloud 認證配置
export const googleAuth = new GoogleAuth({
  scopes: [
    'https://www.googleapis.com/auth/cloud-platform',
    'https://www.googleapis.com/auth/sqlservice.admin'
  ],
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

// 獲取認證令牌
export async function getGoogleAuthToken(): Promise<string> {
  try {
    const authClient = await googleAuth.getClient();
    const accessToken = await authClient.getAccessToken();
    return accessToken.token || '';
  } catch (error) {
    console.error('Error getting Google auth token:', error);
    throw new Error('Failed to authenticate with Google Cloud');
  }
}

// 驗證 Google Cloud 配置
export function validateGoogleCloudConfig(): boolean {
  const requiredEnvVars = [
    'DATABASE_URL'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    return false;
  }

  return true;
}



