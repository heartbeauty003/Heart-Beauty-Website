import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallToActionTile } from './call-to-action-tile';

describe('CallToActionTile', () => {
  let component: CallToActionTile;
  let fixture: ComponentFixture<CallToActionTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallToActionTile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallToActionTile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
