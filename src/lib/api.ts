import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Resolve the API base URL at runtime.
 * Priority:
 * 1) EXPO_PUBLIC_API_BASE_URL (env)
 * 2) On web: use window.location.hostname:4000
 * 3) On native: use Expo dev host IP from hostUri/debuggerHost:4000
 */
export function getApiBaseUrl(): string {
  const envBase = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (envBase && typeof envBase === 'string' && envBase.trim().length > 0) {
    return envBase.replace(/\/$/, '');
  }

  if (Platform.OS === 'web') {
    const hostname = (typeof window !== 'undefined' && window.location?.hostname) || 'localhost';
    const host = hostname || 'localhost';
    return `http://${host}:4000`;
  }

  // Native: try to infer the dev server host from Expo constants
  const anyConstants: any = Constants as any;
  const fromHostUri: string | undefined = (Constants as any)?.expoConfig?.hostUri
    || (anyConstants?.manifest?.hostUri)
    || (anyConstants?.manifest2?.expoGo?.developer?.host)
    || (anyConstants?.debuggerHost);

  if (fromHostUri) {
    try {
      // fromHostUri could be like "192.168.1.20:19000" or full URL
      let hostname = fromHostUri;
      if (hostname.includes('://')) {
        hostname = new URL(hostname).hostname;
      } else if (hostname.includes(':')) {
        hostname = hostname.split(':')[0];
      }
      if (hostname) {
        return `http://${hostname}:4000`;
      }
    } catch {
      // ignore and fall through
    }
  }

  // Final fallback
  return 'http://localhost:4000';
}

export async function apiFetch(path: string, init?: RequestInit) {
  const base = getApiBaseUrl();
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  return fetch(url, init);
}