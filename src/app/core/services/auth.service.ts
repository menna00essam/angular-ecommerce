import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, LoginResponse, RegisterPayload, RegisterResponse } from '../models/user.model';
import { saveAuthState, loadAuthState, clearAuthState } from '../utils/auth-storage.util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_API_URL = 'https://dummyjson.com/auth';

  private _currentUser = signal<User | null>(null);
  private _isAuthenticated = signal<boolean>(false);
  private _authError = signal<string | null>(null);
  private _isLoading = signal<boolean>(false);

  currentUser = computed(() => this._currentUser());
  isAuthenticated = computed(() => this._isAuthenticated());
  authError = computed(() => this._authError());
  isLoading = computed(() => this._isLoading());

  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {
    effect(() => {
      if (this._isAuthenticated()) {
        console.log('User is authenticated:', this._currentUser()?.username);
      } else {
        console.log('User is not authenticated.');
      }
    });

    const stored = loadAuthState();
    if (stored) {
      this._currentUser.set(stored.user);
      this._isAuthenticated.set(true);
      this.setAuthTimer(3600 * 1000);
    }
  }

  private setAuthTimer(expiresInMilliseconds: number): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = setTimeout(() => {
      console.log('Token expired. Logging out automatically.');
      this.logout();
    }, expiresInMilliseconds);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 400) {
        errorMessage = 'Invalid credentials. Please check your username/email and password.';
      } else if (error.error && error.error.message) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = `Server returned code: ${error.status}, error message: ${error.message}`;
      }
    }
    console.error(error);
    this._authError.set(errorMessage);
    this._isLoading.set(false);
    return throwError(() => new Error(errorMessage));
  }

  login(username: string, password: string, rememberMe: boolean): Observable<LoginResponse> {
    this._isLoading.set(true);
    this._authError.set(null);

    return this.http.post<LoginResponse>(`${this.AUTH_API_URL}/login`, { username, password }).pipe(
      tap(response => {
        const user: User = {
          id: response.id,
          username: response.username,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          gender: response.gender,
          image: response.image,
          token: response.token
        };
        this._currentUser.set(user);
        this._isAuthenticated.set(true);
        saveAuthState(response.token, user); // ← بدون this

        this.setAuthTimer(3600 * 1000);
        this._isLoading.set(false);
        this.router.navigate(['/home']);
      }),
      catchError(error => this.handleError(error))
    );
  }

  register(payload: RegisterPayload): Observable<RegisterResponse> {
    this._isLoading.set(true);
    this._authError.set(null);

    return this.http.post<RegisterResponse>('https://dummyjson.com/users/add', payload).pipe(
      tap(response => {
        console.log('Registration successful:', response);
        this._isLoading.set(false);
        this.router.navigate(['/auth/login']);
      }),
      catchError(error => this.handleError(error))
    );
  }

  logout(): void {
    clearAuthState();
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
    this._authError.set(null);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
    this.router.navigate(['/auth/login']);
  }
}
