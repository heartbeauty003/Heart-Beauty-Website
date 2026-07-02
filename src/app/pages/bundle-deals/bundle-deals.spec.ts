import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleDeals } from './bundle-deals';

describe('BundleDeals', () => {
  let component: BundleDeals;
  let fixture: ComponentFixture<BundleDeals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BundleDeals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BundleDeals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
