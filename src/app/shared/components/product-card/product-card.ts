import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';
import { PriceFormatPipe } from '../../../shared/pipes/price-format.pipe';



@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [CommonModule, TranslateModule,PriceFormatPipe],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css'],
})
export class ProductCard {
  @Input() id: number = 0;
  @Input() oldPrice: number = 0;
  @Input() discount: number = 0;
  @Input() imageUrl: string = '';
  @Input() category: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() price: number = 0;
  @Input() isNew: boolean = false;
   @Input() product!: Product;

  isFavorite = false;
  showLoginMessage = false;

private router = inject(Router);
  private cartService = inject(CartService);

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  goToDetails() {
    this.router.navigate(['/products', this.id]);
  }
 handleAddToCart(event: Event): void {
  event.stopPropagation();

  this.cartService.addToCart({
    id: this.id,
    title: this.title,
    price: this.price,
    thumbnail: this.imageUrl
  });
}

}


 
 
 
 
 
 
 
 
 
 
 
 
