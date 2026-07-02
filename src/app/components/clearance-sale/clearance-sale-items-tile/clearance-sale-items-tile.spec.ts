import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearanceSaleItemsTile } from './clearance-sale-items-tile';

describe('ClearanceSaleItemsTile', () => {
  let component: ClearanceSaleItemsTile;
  let fixture: ComponentFixture<ClearanceSaleItemsTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClearanceSaleItemsTile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClearanceSaleItemsTile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
