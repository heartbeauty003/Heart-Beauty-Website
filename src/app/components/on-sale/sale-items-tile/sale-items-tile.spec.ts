import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleItemsTile } from './sale-items-tile';

describe('SaleItemsTile', () => {
  let component: SaleItemsTile;
  let fixture: ComponentFixture<SaleItemsTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleItemsTile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleItemsTile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
