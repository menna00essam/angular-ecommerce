import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, Output, EventEmitter, WritableSignal, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { HeroSlide } from '../../../../core/models/static.model';


@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIconModule],
    templateUrl: './hero-section-component.html',
  styleUrls: ['./hero-section-component.css']
 
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  @Output() navigateToProducts = new EventEmitter<void>();

  currentSlide: WritableSignal<number> = signal(0);
  private slideInterval: any;

heroSlides: HeroSlide[] = [
  {
    id: 0,
    imageUrl: '/assets/images/herosection1.png',
    title: 'heroSlides.0.title',
    description: 'heroSlides.0.description',
    buttonText: 'heroSlides.0.buttonText',
    loading: false
  },
  {
    id: 1,
    imageUrl: '/assets/images/herosection2.png',
    title: 'heroSlides.1.title',
    description: 'heroSlides.1.description',
    buttonText: 'heroSlides.1.buttonText',
    loading: false
  },
  {
    id: 2,
    imageUrl: '/assets/images/herosection1.png',
    title: 'heroSlides.2.title',
    description: 'heroSlides.2.description',
    buttonText: 'heroSlides.2.buttonText',
    loading: false
  }
];


  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  nextSlide(): void {
    const nextIndex = (this.currentSlide() + 1) % this.heroSlides.length;
    this.currentSlide.set(nextIndex);
    this.resetAutoSlide();
  }

  previousSlide(): void {
    const prevIndex = this.currentSlide() === 0
      ? this.heroSlides.length - 1
      : this.currentSlide() - 1;
    this.currentSlide.set(prevIndex);
    this.resetAutoSlide();
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
    this.resetAutoSlide();
  }

  onButtonClick(): void {
    this.navigateToProducts.emit();
  }

  private startAutoSlide(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  private resetAutoSlide(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    this.startAutoSlide();
  }
}