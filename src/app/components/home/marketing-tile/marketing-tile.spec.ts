import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingTile } from './marketing-tile';

describe('MarketingTile', () => {
  let component: MarketingTile;
  let fixture: ComponentFixture<MarketingTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketingTile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketingTile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
