import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedProductsSection } from './featured-products-section';

describe('FeaturedProductsSection', () => {
  let component: FeaturedProductsSection;
  let fixture: ComponentFixture<FeaturedProductsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedProductsSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedProductsSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
