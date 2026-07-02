import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureHighlightTile } from './feature-highlight-tile';

describe('FeatureHighlightTile', () => {
  let component: FeatureHighlightTile;
  let fixture: ComponentFixture<FeatureHighlightTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureHighlightTile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeatureHighlightTile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
