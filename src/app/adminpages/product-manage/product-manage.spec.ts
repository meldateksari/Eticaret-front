import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductManage } from './product-manage';

describe('ProductManage', () => {
  let component: ProductManage;
  let fixture: ComponentFixture<ProductManage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductManage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductManage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
