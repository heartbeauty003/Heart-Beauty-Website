import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsHighlightTile } from './products-highlight-tile';

describe('ProductsHighlightTile', () => {
  let component: ProductsHighlightTile;
  let fixture: ComponentFixture<ProductsHighlightTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsHighlightTile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsHighlightTile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
