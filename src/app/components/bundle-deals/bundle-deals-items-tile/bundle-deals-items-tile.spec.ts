import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleDealsItemsTile } from './bundle-deals-items-tile';

describe('BundleDealsItemsTile', () => {
  let component: BundleDealsItemsTile;
  let fixture: ComponentFixture<BundleDealsItemsTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BundleDealsItemsTile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BundleDealsItemsTile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
