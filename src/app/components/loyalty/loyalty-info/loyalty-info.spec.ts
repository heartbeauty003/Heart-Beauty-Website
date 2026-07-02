import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyInfo } from './loyalty-info';

describe('LoyaltyInfo', () => {
  let component: LoyaltyInfo;
  let fixture: ComponentFixture<LoyaltyInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoyaltyInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoyaltyInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
