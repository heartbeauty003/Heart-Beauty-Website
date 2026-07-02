import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingNowBanner } from './trending-now-banner';

describe('TrendingNowBanner', () => {
  let component: TrendingNowBanner;
  let fixture: ComponentFixture<TrendingNowBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrendingNowBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingNowBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
