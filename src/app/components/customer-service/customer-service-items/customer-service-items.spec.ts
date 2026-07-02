import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerServiceItems } from './customer-service-items';

describe('CustomerServiceItems', () => {
  let component: CustomerServiceItems;
  let fixture: ComponentFixture<CustomerServiceItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerServiceItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerServiceItems);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
