import { Injectable, signal, effect } from '@angular/core';
import { saveToStorage, loadFromStorage } from '../utils/storage.util';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';
  
  currentTheme = signal<Theme>(this.getStoredTheme() || 'light');
  
  constructor() {
    effect(() => {
      this.applyTheme(this.currentTheme());
    });
  }
  
  toggleTheme(): void {
    const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
  
  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    saveToStorage(this.THEME_KEY, theme);
  }
  
  private getStoredTheme(): Theme | null {
    const stored = loadFromStorage<Theme>(this.THEME_KEY);
    return (stored === 'light' || stored === 'dark') ? stored : null;
  }
  
  private applyTheme(theme: Theme): void {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }
}
