import { Injectable, signal, effect } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { saveToStorage, loadFromStorage } from '../utils/storage.util';

export type Language = 'en' | 'ar';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANGUAGE_KEY = 'app-language';
  
  currentLanguage = signal<Language>(this.getStoredLanguage() || 'en');
  
  isRTL = signal<boolean>(false);
  
  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('en');
    
    effect(() => {
      const lang = this.currentLanguage();
      this.applyLanguage(lang);
    });
  }
  
  switchLanguage(language: Language): void {
    this.currentLanguage.set(language);
    saveToStorage(this.LANGUAGE_KEY, language);
  }
  
  private getStoredLanguage(): Language | null {
    const stored = loadFromStorage<Language>(this.LANGUAGE_KEY);
    return (stored === 'en' || stored === 'ar') ? stored : null;
  }
  
  private applyLanguage(language: Language): void {
    this.translate.use(language);
    this.isRTL.set(language === 'ar');
    
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }
}
