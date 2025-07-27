import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPurchaseSection } from './product-purchase-section';

describe('ProductPurchaseSection', () => {
  let component: ProductPurchaseSection;
  let fixture: ComponentFixture<ProductPurchaseSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPurchaseSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductPurchaseSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
