import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyCQbu7dkcDkCnpVkb_ayOX1PvREQqyJpgk",
  authDomain: "heart-beauty-site.firebaseapp.com",
  projectId: "heart-beauty-site",
  storageBucket: "heart-beauty-site.firebasestorage.app",
  messagingSenderId: "143255256584",
  appId: "1:143255256584:web:90174eec61a704834d9bbd",
  measurementId: "G-6R9ZJPF0QJ"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};