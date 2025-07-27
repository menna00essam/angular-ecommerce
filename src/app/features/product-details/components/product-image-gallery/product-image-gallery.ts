import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-image-gallery',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="space-y-4">
      <!-- Main Image -->
      <div class="relative w-full bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200 aspect-square">
        <img 
          [src]="selectedImage" 
          [alt]="productTitle" 
          class="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
          loading="eager"
        />
        
        <!-- Badges -->
        <div class="absolute top-4 left-4 flex gap-2 z-10">
          <span 
            *ngIf="isNew" 
            class="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide"
          >
            {{ 'NEW' | translate }}
          </span>
          <span 
            *ngIf="discountPercentage && discountPercentage > 0" 
            class="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide"
          >
            -{{ discountPercentage }}%
          </span>
        </div>
      </div>

      <!-- Thumbnail Gallery -->
      <div 
        *ngIf="images && images.length > 1" 
        class="flex gap-3 flex-wrap"
      >
        <div
          *ngFor="let image of images; let i = index"
          class="w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 hover:border-primary hover:-translate-y-0.5"
          [class]="selectedImageIndex === i ? 'border-primary shadow-lg shadow-primary' : 'border-gray-200'"
          (click)="selectImage(i)"
        >
          <img 
            [src]="image" 
            [alt]="productTitle + ' image ' + (i + 1)" 
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  `
})
export class ProductImageGallery {
  @Input() images: string[] = [];
  @Input() selectedImage: string = '';
  @Input() selectedImageIndex: number = 0;
  @Input() productTitle: string = '';
  @Input() isNew: boolean = false;
  @Input() discountPercentage: number = 0;
  
  @Output() imageSelect = new EventEmitter<number>();

  selectImage(index: number): void {
    this.imageSelect.emit(index);
  }
}
