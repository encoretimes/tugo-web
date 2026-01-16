/**
 * PWA용 토큰 저장소
 * IndexedDB를 사용하여 토큰을 저장
 * PWA standalone 모드에서 쿠키가 초기화될 때 세션 복구에 사용
 */

const DB_NAME = 'tugo_auth';
const DB_VERSION = 1;
const STORE_NAME = 'tokens';
const TOKEN_KEY = 'auth_tokens';

interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  savedAt: number;
}

/**
 * IndexedDB 열기
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

/**
 * 토큰 저장
 */
export async function saveTokens(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const tokens: StoredTokens = {
      accessToken,
      refreshToken,
      savedAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const request = store.put(tokens, TOKEN_KEY);

      request.onsuccess = () => {
        db.close();
        resolve();
      };

      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('[TokenStorage] Failed to save tokens:', error);
    throw error;
  }
}

/**
 * 토큰 조회
 */
export async function getTokens(): Promise<StoredTokens | null> {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get(TOKEN_KEY);

      request.onsuccess = () => {
        db.close();
        resolve(request.result || null);
      };

      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('[TokenStorage] Failed to get tokens:', error);
    return null;
  }
}

/**
 * 토큰 삭제
 */
export async function clearTokens(): Promise<void> {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.delete(TOKEN_KEY);

      request.onsuccess = () => {
        db.close();
        resolve();
      };

      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('[TokenStorage] Failed to clear tokens:', error);
    throw error;
  }
}

/**
 * IndexedDB 지원 여부 확인
 */
export function isIndexedDBSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'indexedDB' in window;
}
