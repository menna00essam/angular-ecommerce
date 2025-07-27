import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-offers-section',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './offers-section.html',
  styleUrls: ['./offers-section.css']
  
})
export class OffersSection {
  @Output() navigateToProducts = new EventEmitter<void>();

  onOfferClick(): void {
    this.navigateToProducts.emit();
  }
}