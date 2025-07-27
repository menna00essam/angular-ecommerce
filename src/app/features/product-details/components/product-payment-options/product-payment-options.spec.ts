import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPaymentOptions } from './product-payment-options';

describe('ProductPaymentOptions', () => {
  let component: ProductPaymentOptions;
  let fixture: ComponentFixture<ProductPaymentOptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPaymentOptions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductPaymentOptions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
