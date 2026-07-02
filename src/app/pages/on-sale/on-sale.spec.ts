import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnSale } from './on-sale';

describe('OnSale', () => {
  let component: OnSale;
  let fixture: ComponentFixture<OnSale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnSale]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnSale);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
