/* Firebase Cloud Messaging — background push handler.
 *
 * This file only does anything when push is configured: the app registers it
 * with the Firebase web-app config passed as query params (see
 * src/api/firebaseMessaging.js). Without that registration it stays idle.
 */
/* global importScripts, firebase, self, clients */
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

const params = new URL(self.location).searchParams;
const config = {
  apiKey: params.get("apiKey"),
  authDomain: params.get("authDomain"),
  projectId: params.get("projectId"),
  storageBucket: params.get("storageBucket"),
  messagingSenderId: params.get("messagingSenderId"),
  appId: params.get("appId"),
};

if (config.apiKey && config.projectId) {
  firebase.initializeApp(config);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const { title, body } = payload.notification || {};
    self.registration.showNotification(title || "PetCare", {
      body: body || "",
      icon: "/vite.svg",
      data: payload.data || {},
    });
  });
}

// Focus (or open) the chat when a notification is clicked.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((list) => {
      for (const client of list) {
        if ("focus" in client) return client.focus();
      }
      return clients.openWindow("/#/app/chat");
    })
  );
});
