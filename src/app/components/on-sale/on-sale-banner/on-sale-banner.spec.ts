import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnSaleBanner } from './on-sale-banner';

describe('OnSaleBanner', () => {
  let component: OnSaleBanner;
  let fixture: ComponentFixture<OnSaleBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnSaleBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnSaleBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
