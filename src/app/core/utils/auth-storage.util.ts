import { User } from '../models/user.model';

const AUTH_TOKEN_KEY = 'authToken';
const CURRENT_USER_KEY = 'currentUser';

export function saveAuthState(token: string, user: User): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function loadAuthState(): { token: string; user: User } | null {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const userJson = localStorage.getItem(CURRENT_USER_KEY);

  if (!token || !userJson) return null;

  try {
    const user: User = JSON.parse(userJson);
    return { token, user };
  } catch (e) {
    console.error('Failed to parse user from localStorage:', e);
    return null;
  }
}

export function clearAuthState(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
}
