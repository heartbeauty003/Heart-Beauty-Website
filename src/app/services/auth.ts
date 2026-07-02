import { inject, Injectable, NgZone } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  user,
  User,
  UserCredential
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { UsersService } from './users/users.service';

const INACTIVITY_LIMIT = 60 * 60 * 1000; // 1 hour
const LAST_ACTIVE_KEY = 'hb_last_active';
const SESSION_USER_KEY = 'hb_session_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  public router = inject(Router);
  private ngZone = inject(NgZone);

  private _currentUser = new BehaviorSubject<User | null>(null);
  private inactivityTimer: any = null;

  /** Observable of the Firebase User — use in components */
  user$: Observable<User | null> = user(this.auth);

  /** BehaviorSubject for synchronous access */
  currentUser$ = this._currentUser.asObservable();

  constructor() {
    this.initSessionTracking();
  }

  // ── Getters ──────────────────────────────────────────────────────

  get currentUser(): User | null {
    return this._currentUser.value;
  }

  get isLoggedIn(): boolean {
    return this._currentUser.value !== null;
  }

  get userEmail(): string | null {
    return this._currentUser.value?.email ?? null;
  }

  get userDisplayName(): string | null {
    return this._currentUser.value?.displayName ?? null;
  }

  get userPhotoURL(): string | null {
    return this._currentUser.value?.photoURL ?? null;
  }

  get userUID(): string | null {
    return this._currentUser.value?.uid ?? null;
  }

  // ── Session Tracking ─────────────────────────────────────────────

  private initSessionTracking(): void {
    this.user$.subscribe((firebaseUser) => {
      this.ngZone.run(() => {
        this._currentUser.next(firebaseUser);

        if (firebaseUser) {
          this.saveSessionUser(firebaseUser);
          this.checkInactivity();
          this.startInactivityTimer();
          this.bindActivityEvents();
        } else {
          this.clearSession();
        }
      });
    });
  }

  private saveSessionUser(firebaseUser: User): void {
    const existing = localStorage.getItem(SESSION_USER_KEY);
    const sessionData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      loginTime: existing
        ? JSON.parse(existing).loginTime
        : new Date().toISOString()
    };
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(sessionData));
    this.updateLastActive();
  }

  private updateLastActive(): void {
    localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
  }

  private checkInactivity(): void {
    const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
    if (lastActive) {
      const elapsed = Date.now() - parseInt(lastActive);
      if (elapsed > INACTIVITY_LIMIT) {
        this.logout();
      }
    }
  }

  private startInactivityTimer(): void {
    this.clearInactivityTimer();
    this.inactivityTimer = setTimeout(() => {
      this.ngZone.run(() => this.logout());
    }, INACTIVITY_LIMIT);
  }

  private clearInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  private bindActivityEvents(): void {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    const onActivity = () => {
      this.updateLastActive();
      this.startInactivityTimer();
    };
    events.forEach(event => {
      window.removeEventListener(event, onActivity);
      window.addEventListener(event, onActivity, { passive: true });
    });
  }

  private clearSession(): void {
    localStorage.removeItem(LAST_ACTIVE_KEY);
    localStorage.removeItem(SESSION_USER_KEY);
    this.clearInactivityTimer();
  }

  // ── Session Info ─────────────────────────────────────────────────

  getSessionInfo(): { uid: string; email: string; displayName: string; photoURL: string; loginTime: string } | null {
    const raw = localStorage.getItem(SESSION_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  // ── Auth Methods ─────────────────────────────────────────────────

  /**
   * Creates a Firebase Auth account, sends a verification email,
   * then immediately signs the user back out.
   * The Firestore user profile is NOT created here — it is created on
   * the first successful verified login via loginWithEmail().
   */
  async register(email: string, password: string): Promise<UserCredential> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    await sendEmailVerification(credential.user);
    await signOut(this.auth);
    return credential;
  }

  /**
   * Email/password login with email verification enforcement.
   *
   * - If the user has not verified their email, they are signed back out
   *   and an error with code 'auth/email-not-verified' is thrown.
   * - On the first successful verified login the Firestore profile is
   *   created (deferred from registration).
   *
   * Usage in your LoginForm:
   *
   *   try {
   *     await this.authService.loginWithEmail(email, password, this.usersService);
   *     this.router.navigate(['/']);
   *   } catch (err: any) {
   *     if (err.code === 'auth/email-not-verified') {
   *       this.errorMessage = 'Please verify your email before logging in.';
   *     } else if (err.code === 'auth/invalid-credential') {
   *       this.errorMessage = 'Incorrect email or password.';
   *     } else {
   *       this.errorMessage = 'Login failed. Please try again.';
   *     }
   *   }
   */
  async loginWithEmail(
    email: string,
    password: string,
    usersService: UsersService
  ): Promise<UserCredential> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    const user = credential.user;

    if (!user.emailVerified) {
      await signOut(this.auth);
      const err: any = new Error('Email not verified. Please check your inbox.');
      err.code = 'auth/email-not-verified';
      throw err;
    }

    // First verified login — create the Firestore profile if it doesn't exist yet.
    const existing = await usersService.getUserProfile(user.uid);
    if (!existing) {
      const nameParts = (user.displayName ?? '').split(' ');
      await usersService.createUserProfile(
        user.uid,
        nameParts[0] ?? '',
        nameParts.slice(1).join(' ') ?? '',
        user.email ?? email
      );
    }

    return credential;
  }

  async loginWithGoogle(): Promise<UserCredential> {
    return await signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  async loginWithFacebook(): Promise<UserCredential> {
    return await signInWithPopup(this.auth, new FacebookAuthProvider());
  }

  async resetPassword(email: string): Promise<void> {
    return await sendPasswordResetEmail(this.auth, email);
  }

  async logout(): Promise<void> {
    this.clearSession();
    await signOut(this.auth);
    this.router.navigate(['/']);
  }
}