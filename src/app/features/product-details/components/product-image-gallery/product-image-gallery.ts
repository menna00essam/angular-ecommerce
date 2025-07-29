import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-image-gallery',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './product-image-gallery.html',
  styleUrls: ['./product-image-gallery.css']
 
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
