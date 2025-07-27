import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsHeader } from './products-header';

describe('ProductsHeader', () => {
  let component: ProductsHeader;
  let fixture: ComponentFixture<ProductsHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
