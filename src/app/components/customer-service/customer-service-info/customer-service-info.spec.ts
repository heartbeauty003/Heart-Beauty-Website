import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerServiceInfo } from './customer-service-info';

describe('CustomerServiceInfo', () => {
  let component: CustomerServiceInfo;
  let fixture: ComponentFixture<CustomerServiceInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerServiceInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerServiceInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
