import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoyaltyMembership } from './loyalty-membership';

describe('LoyaltyMembership', () => {
  let component: LoyaltyMembership;
  let fixture: ComponentFixture<LoyaltyMembership>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoyaltyMembership]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoyaltyMembership);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});