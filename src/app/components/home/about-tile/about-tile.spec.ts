import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutTile } from './about-tile';

describe('AboutTile', () => {
  let component: AboutTile;
  let fixture: ComponentFixture<AboutTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutTile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutTile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
