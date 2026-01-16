/// <reference lib="webworker" />

// Push 이벤트 핸들러
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};

  const options = {
    body: data.body || '새로운 알림이 있습니다',
    icon: data.icon || '/system_ico/icon-192x192.png',
    badge: data.badge || '/system_ico/icon-72x72.png',
    tag: data.tag || 'tugo-notification',
    requireInteraction: data.requireInteraction ?? false,
    data: {
      url: data.url || '/',
    },
    vibrate: [100, 50, 100],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Tugo', options)
  );
});

// 알림 클릭 핸들러
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  const url = event.notification.data?.url || '/';

  // 닫기 액션이면 아무것도 안함
  if (action === 'close') {
    return;
  }

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // 이미 열린 창이 있으면 포커스하고 해당 URL로 이동
        for (const client of clientList) {
          if ('focus' in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        // 없으면 새 창 열기
        return self.clients.openWindow(url);
      })
  );
});

// 알림 닫기 핸들러
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag);
});
