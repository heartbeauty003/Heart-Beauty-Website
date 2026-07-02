import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingNowItemsTile } from './trending-now-items-tile';

describe('TrendingNowItemsTile', () => {
  let component: TrendingNowItemsTile;
  let fixture: ComponentFixture<TrendingNowItemsTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrendingNowItemsTile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingNowItemsTile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
