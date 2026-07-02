import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionsBanner } from './promotions-banner';

describe('PromotionsBanner', () => {
  let component: PromotionsBanner;
  let fixture: ComponentFixture<PromotionsBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionsBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionsBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
