import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionsItemsTile } from './promotions-items-tile';

describe('PromotionsItemsTile', () => {
  let component: PromotionsItemsTile;
  let fixture: ComponentFixture<PromotionsItemsTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionsItemsTile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionsItemsTile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
