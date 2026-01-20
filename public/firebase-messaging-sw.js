// public/firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing in the messagingSenderId
firebase.initializeApp({
  apiKey: "AIzaSyBb3-9vqoRh1-N6ZTKuivomiFvxX26pncU",
  authDomain: "autory-8d048.firebaseapp.com",
  projectId: "autory-8d048",
  storageBucket: "autory-8d048.appspot.com",
  messagingSenderId: "161834911029",
  appId: "1:161834911029:web:853accbb65727e7c5db87c",
  measurementId: "G-0CRLVK8TT8",
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
