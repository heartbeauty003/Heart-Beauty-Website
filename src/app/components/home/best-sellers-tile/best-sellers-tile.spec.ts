import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestSellersTile } from './best-sellers-tile';

describe('BestSellersTile', () => {
  let component: BestSellersTile;
  let fixture: ComponentFixture<BestSellersTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestSellersTile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BestSellersTile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
