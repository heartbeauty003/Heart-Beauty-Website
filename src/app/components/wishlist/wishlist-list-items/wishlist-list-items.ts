import { Component, OnInit, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../../services/wishlist/wishlist.service';
import { WishlistModel } from '../../../models/wishlist/wishlist.model';
import { CartService } from '../../../services/cart/cart.service';
import { AuthService } from '../../../services/auth';
import { Subscription, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-wishlist-list-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist-list-items.html',
  styleUrl: './wishlist-list-items.css'
})
export class WishlistListItems implements OnInit, OnDestroy {
  private wishlistService = inject(WishlistService);
  private cartService     = inject(CartService);
  private authService     = inject(AuthService);
  private cdr             = inject(ChangeDetectorRef);

  private sub: Subscription | null = null;

  activeToasts: { id: number }[] = [];
  private toastIdCounter = 0;
  wishlistItems: WishlistModel[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.sub = this.authService.currentUser$.pipe(
      switchMap(user => {
        if (user) return this.wishlistService.getWishlistItems(user.uid);
        return of([]);
      })
    ).subscribe({
      next: (items) => {
        this.wishlistItems = items;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[WishlistListItems] Error loading wishlist:', err);
        this.wishlistItems = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  async addToCart(item: WishlistModel): Promise<void> {
    const userId = this.authService.userUID;
    if (!userId) return;
    await this.cartService.addToCart(userId, {
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
    this.triggerToast();
  }

  async removeItem(productId: string): Promise<void> {
    const userId = this.authService.userUID;
    if (!userId) return;
    await this.wishlistService.removeFromWishlist(userId, productId);
  }

  private triggerToast(): void {
    const currentId = ++this.toastIdCounter;
    this.activeToasts.push({ id: currentId });
    this.cdr.detectChanges();
    setTimeout(() => {
      this.activeToasts = this.activeToasts.filter(t => t.id !== currentId);
      this.cdr.detectChanges();
    }, 1500);
  }

  formatSection(section: string): string {
    return section
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

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
}