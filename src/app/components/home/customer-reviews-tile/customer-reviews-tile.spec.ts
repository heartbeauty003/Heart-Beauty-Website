import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerReviewsTile } from './customer-reviews-tile';

describe('CustomerReviewsTile', () => {
  let component: CustomerReviewsTile;
  let fixture: ComponentFixture<CustomerReviewsTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerReviewsTile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerReviewsTile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
