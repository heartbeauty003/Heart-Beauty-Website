import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingNow } from './trending-now';

describe('TrendingNow', () => {
  let component: TrendingNow;
  let fixture: ComponentFixture<TrendingNow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrendingNow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingNow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
