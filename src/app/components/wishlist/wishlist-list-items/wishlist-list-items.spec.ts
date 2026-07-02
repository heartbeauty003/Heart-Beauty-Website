import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistListItems } from './wishlist-list-items';

describe('WishlistListItems', () => {
  let component: WishlistListItems;
  let fixture: ComponentFixture<WishlistListItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishlistListItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishlistListItems);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
