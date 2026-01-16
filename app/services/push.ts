import { apiClient } from '@/lib/api-client';

/**
 * Base64 URL-safe 문자열을 Uint8Array로 변환
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * ArrayBuffer를 Base64 문자열로 변환
 */
function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Push 알림 지원 여부 확인
 */
export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * 현재 Push 권한 상태 조회
 */
export function getPushPermissionStatus(): NotificationPermission | null {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }
  return Notification.permission;
}

/**
 * VAPID 공개키 조회
 */
export async function getVapidPublicKey(): Promise<string | null> {
  try {
    const response = await apiClient.get<string>(
      '/api/v1/push/vapid-public-key'
    );
    return response;
  } catch {
    console.error('Failed to fetch VAPID public key');
    return null;
  }
}

/**
 * Push 서비스 상태 확인
 */
export async function isPushServiceAvailable(): Promise<boolean> {
  try {
    const response = await apiClient.get<boolean>('/api/v1/push/status');
    return response;
  } catch {
    return false;
  }
}

/**
 * Push 알림 구독
 */
export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!isPushSupported()) {
    console.warn('Push notifications not supported');
    return null;
  }

  // 권한 요청
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.warn('Push notification permission denied');
    return null;
  }

  // Service Worker 준비
  const registration = await navigator.serviceWorker.ready;

  // VAPID 공개키 조회
  const vapidPublicKey = await getVapidPublicKey();
  if (!vapidPublicKey) {
    throw new Error('VAPID public key not configured');
  }

  // Push 구독
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
  });

  // 서버에 구독 정보 전송
  await apiClient.post('/api/v1/push/subscribe', {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
      auth: arrayBufferToBase64(subscription.getKey('auth')),
    },
  });

  return subscription;
}

/**
 * Push 알림 구독 해제
 */
export async function unsubscribeFromPush(): Promise<void> {
  if (!isPushSupported()) {
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    // 서버에서 구독 해제
    await apiClient.delete('/api/v1/push/unsubscribe', {
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    });

    // 브라우저에서 구독 해제
    await subscription.unsubscribe();
  }
}

/**
 * 현재 Push 구독 상태 확인
 */
export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch {
    return null;
  }
}

/**
 * Push 알림 활성화 여부 확인
 */
export async function isPushEnabled(): Promise<boolean> {
  const subscription = await getCurrentSubscription();
  return subscription !== null;
}
