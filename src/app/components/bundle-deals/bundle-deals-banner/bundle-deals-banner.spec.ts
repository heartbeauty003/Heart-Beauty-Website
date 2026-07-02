import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleDealsBanner } from './bundle-deals-banner';

describe('BundleDealsBanner', () => {
  let component: BundleDealsBanner;
  let fixture: ComponentFixture<BundleDealsBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BundleDealsBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BundleDealsBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
