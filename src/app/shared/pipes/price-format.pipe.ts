import { Pipe, PipeTransform } from '@angular/core';
import { inject } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

@Pipe({
  name: 'priceFormat',
  standalone: true,
  pure: false
})
export class PriceFormatPipe implements PipeTransform {

  private languageService = inject(LanguageService);

  transform(value: number): string {
    const lang = this.languageService.currentLanguage();

    if (lang === 'ar') {
      return value.toLocaleString('ar-EG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + ' ر.س.‏';
    }

    return 'SAR ' + value.toFixed(2);
  }
}
