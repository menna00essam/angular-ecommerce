import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductShowcaseSection } from './product-showcase-section';

describe('ProductShowcaseSection', () => {
  let component: ProductShowcaseSection;
  let fixture: ComponentFixture<ProductShowcaseSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductShowcaseSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductShowcaseSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
