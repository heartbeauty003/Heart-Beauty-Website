import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearanceSaleBanner } from './clearance-sale-banner';

describe('ClearanceSaleBanner', () => {
  let component: ClearanceSaleBanner;
  let fixture: ComponentFixture<ClearanceSaleBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClearanceSaleBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClearanceSaleBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
