import { Component, computed, signal, inject, HostListener, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../services/auth';
import { SearchService } from '../../../services/search/search.service';
import { CartService } from '../../../services/cart/cart.service';
import { WishlistService } from '../../../services/wishlist/wishlist.service';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import type { Product } from '../../../services/search/search.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnDestroy {
  private authService          = inject(AuthService);
  protected searchService      = inject(SearchService);
  private router               = inject(Router);
  private elRef                = inject(ElementRef);
  private cartService          = inject(CartService);
  private wishlistService      = inject(WishlistService);
  private notificationsService = inject(NotificationsService);

  protected readonly isSidebarOpen      = signal(false);
  protected readonly isMobileSearchOpen = signal(false);
  protected readonly searchTerm         = signal('');
  protected readonly wishlistedMap      = signal<Record<string, boolean>>({});
  protected readonly notificationCount  = signal(0);

  protected activeToasts: { id: number; type: 'wishlist' | 'cart' }[] = [];
  private toastIdCounter = 0;

  private notificationsSub = this.notificationsService.getActiveNotifications().subscribe({
    next: (items) => this.notificationCount.set(items.length),
    error: () => this.notificationCount.set(0)
  });

  protected readonly currentUser = toSignal(this.authService.user$, { initialValue: null });

  protected readonly searchResults = toSignal(
    this.searchService.searchResults$,
    { initialValue: [] as Product[] }
  );

  protected readonly isSearchOpen = computed(() =>
    this.searchTerm().trim().length > 0
  );

  protected readonly userInitials = computed(() => {
    const user = this.currentUser();
    if (!user) return '';
    const name  = user.displayName;
    const email = user.email;
    if (name) {
      const parts = name.trim().split(' ');
      return parts.length >= 2
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : parts[0][0].toUpperCase();
    }
    if (email) return email[0].toUpperCase();
    return '?';
  });

  ngOnDestroy(): void {
    this.notificationsSub.unsubscribe();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.closeSearch();
    }
  }

  // ── Desktop search ─────────────────────────────────────────────────

  protected onSearchInput(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
    this.searchService.search(term);
    if (term.trim().length > 0) {
      this.loadWishlistStates();
    }
  }

  protected selectProduct(product: Product): void {
    this.closeSearch();
    this.closeMobileSearch();
    this.router.navigate(['/product', product.id]);
  }

  protected closeSearch(): void {
    this.searchTerm.set('');
    this.searchService.clear();
    this.wishlistedMap.set({});
  }

  // ── Mobile search overlay ──────────────────────────────────────────

  protected openMobileSearch(): void {
    this.closeSidebar();
    this.isMobileSearchOpen.set(true);
    setTimeout(() => {
      const input = document.getElementById('mobile-search-input');
      if (input) input.focus();
    }, 100);
  }

  protected closeMobileSearch(): void {
    this.isMobileSearchOpen.set(false);
    this.closeSearch();
  }

  protected onMobileSearchInput(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
    this.searchService.search(term);
    if (term.trim().length > 0) {
      this.loadWishlistStates();
    }
  }

  // ── Sidebar ────────────────────────────────────────────────────────

  protected toggleSidebar(): void {
    this.isSidebarOpen.update(s => !s);
  }

  protected closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  // ── Wishlist state loader ──────────────────────────────────────────

  private async loadWishlistStates(): Promise<void> {
    const userId = this.authService.userUID;
    if (!userId) return;
    setTimeout(async () => {
      const results = this.searchResults();
      const entries = await Promise.all(
        results.map(async p => {
          const state = await this.wishlistService.isInWishlist(userId, p.id);
          return [p.id, state] as [string, boolean];
        })
      );
      this.wishlistedMap.set(Object.fromEntries(entries));
    }, 300);
  }

  protected isWishlisted(productId: string): boolean {
    return this.wishlistedMap()[productId] ?? false;
  }

  // ── Cart action ────────────────────────────────────────────────────

  protected async addToCart(product: Product, event: Event): Promise<void> {
    event.stopPropagation();
    if (!this.authService.isLoggedIn) { this.router.navigate(['/login']); return; }
    try {
      await this.cartService.addToCart(this.authService.userUID!, {
        productId:    product.id,
        name:         product.title,
        price:        product.price,
        initialPrice: product.initialPrice  ?? product.price,
        isDiscounted: product.isDiscounted  ?? false,
        image:        product.imageUrl,
        rating:       product.rating        ?? 0,
        inStock:      product.inStock       ?? true,
        stockCount:   product.stockCount    ?? 0,
        section:      product.section       ?? '',
        color:        product.color,
        size:         product.size,
        unit:         product.unit
      });
      this.triggerToast('cart');
    } catch (err) {
      console.error('[Navbar] Failed to add to cart:', err);
    }
  }

  // ── Wishlist action ────────────────────────────────────────────────

  protected async toggleWishlist(product: Product, event: Event): Promise<void> {
    event.stopPropagation();
    if (!this.authService.isLoggedIn) { this.router.navigate(['/login']); return; }
    try {
      const nowInWishlist = await this.wishlistService.toggleWishlist(
        this.authService.userUID!,
        {
          productId:    product.id,
          name:         product.title,
          price:        product.price,
          initialPrice: product.initialPrice,
          isDiscounted: product.isDiscounted,
          image:        product.imageUrl,
          rating:       product.rating,
          inStock:      product.inStock,
          stockCount:   product.stockCount,
          section:      product.section,
          size:         product.size,
          unit:         product.unit
        }
      );
      this.wishlistedMap.update(map => ({ ...map, [product.id]: nowInWishlist }));
      if (nowInWishlist) this.triggerToast('wishlist');
    } catch (err) {
      console.error('[Navbar] Failed to toggle wishlist:', err);
    }
  }

  // ── Toast ──────────────────────────────────────────────────────────

  protected triggerToast(type: 'wishlist' | 'cart'): void {
    const id = ++this.toastIdCounter;
    this.activeToasts.push({ id, type });
    setTimeout(() => {
      this.activeToasts = this.activeToasts.filter(t => t.id !== id);
    }, 1500);
  }
}