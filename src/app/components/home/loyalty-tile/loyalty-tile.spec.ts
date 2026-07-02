import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyTile } from './loyalty-tile';

describe('LoyaltyTile', () => {
  let component: LoyaltyTile;
  let fixture: ComponentFixture<LoyaltyTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoyaltyTile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoyaltyTile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
