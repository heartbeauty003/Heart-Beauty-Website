// src/app/components/cart/cart-items/cart-items.ts
import { Component, OnInit, inject, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { CartService } from '../../../services/cart/cart.service';
import { CartModel } from '../../../models/cart/cart.model';
import { WishlistService } from '../../../services/wishlist/wishlist.service';
import { Subscription, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-cart-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-items.html',
  styleUrl: './cart-items.css'
})
export class CartItems implements OnInit, OnDestroy {
  @Output() itemsChanged = new EventEmitter<CartModel[]>();

  private cartService     = inject(CartService);
  private wishlistService = inject(WishlistService);
  private authService     = inject(AuthService);
  private cdr             = inject(ChangeDetectorRef);

  private sub: Subscription | null = null;

  items: CartModel[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.sub = this.authService.user$.pipe(
      tap(user => {
        if (!user) {
          console.warn('[CartItems] No user logged in!');
          this.isLoading = false;
        } else {
          console.log('[CartItems] Fetching cart for UID:', user.uid);
        }
      }),
      switchMap(user => {
        if (user) return this.cartService.getCartItems(user.uid);
        return of([]);
      })
    ).subscribe({
      next: (items) => {
        console.log('[CartItems] Received items in component:', items);
        this.items = items;
        this.isLoading = false;
        this.itemsChanged.emit(this.items);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[CartItems] Failed to load cart:', err);
        this.items = [];
        this.isLoading = false;
        this.itemsChanged.emit(this.items);
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  async decreaseQuantity(item: CartModel): Promise<void> {
    const userId = this.authService.userUID;
    if (!userId || item.quantity <= 1) return;
    await this.cartService.updateQuantity(userId, item.productId, item.quantity - 1);
  }

  async increaseQuantity(item: CartModel): Promise<void> {
    const userId = this.authService.userUID;
    if (!userId) return;
    await this.cartService.updateQuantity(userId, item.productId, item.quantity + 1);
  }

  async removeItem(item: CartModel): Promise<void> {
    const userId = this.authService.userUID;
    if (!userId) return;
    await this.cartService.removeFromCart(userId, item.productId);
  }

  async moveToList(item: CartModel): Promise<void> {
    const userId = this.authService.userUID;
    if (!userId) return;

    try {
      await this.wishlistService.addToWishlist(userId, {
        productId:    item.productId,
        name:         item.name,
        price:        item.price,
        initialPrice: item.initialPrice,
        isDiscounted: item.isDiscounted,
        image:        item.image,
        rating:       item.rating,
        inStock:      item.inStock,
        stockCount:   item.stockCount,
        section:      item.section,
        color:        item.color,
        size:         item.size,
        unit:         item.unit
      });
      await this.removeItem(item);
    } catch (error) {
      console.error('[CartItems] Failed to move item to wishlist:', error);
    }
  }

  // Mirror of wishlist helper — generates array of 1 (full), 0.5 (half), 0 (empty) per star slot
  getStars(rating: number | undefined): number[] {
    const r = rating || 0;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (r >= i)            stars.push(1);
      else if (r >= i - 0.5) stars.push(0.5);
      else                   stars.push(0);
    }
    return stars;
  }

  // Mirror of wishlist helper — formats snake_case section names to Title Case
  formatSection(section: string): string {
    return section
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}