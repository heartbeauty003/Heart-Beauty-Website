import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearanceSale } from './clearance-sale';

describe('ClearanceSale', () => {
  let component: ClearanceSale;
  let fixture: ComponentFixture<ClearanceSale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClearanceSale]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClearanceSale);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
