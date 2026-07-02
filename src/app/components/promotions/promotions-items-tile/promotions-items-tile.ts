import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';
import { AuthService } from '../../../services/auth';
import { CartService } from '../../../services/cart/cart.service';
import { WishlistService } from '../../../services/wishlist/wishlist.service';

interface PromotionProduct {
  productId:    string;
  title:        string;
  desc:         string;
  currentPrice: string;
  originalPrice: string;
  stock:        string;
  inStock:      boolean;
  stockCount:   number;
  img:          string;
  stars:        number[];
  isWishlisted: boolean;
  rawPrice:     number;
  initialPrice: number;
  isDiscounted: boolean;
  rating:       number;
  section:      string;
  color:        string;
  size:         number;
  unit:         string;
}

@Component({
  selector: 'app-promotions-items-tile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promotions-items-tile.html',
  styleUrl: './promotions-items-tile.css',
})
export class PromotionsItemsTile implements OnInit {

  private authService     = inject(AuthService);
  private cartService     = inject(CartService);
  private wishlistService = inject(WishlistService);
  private cdr             = inject(ChangeDetectorRef);
  private firestore       = inject(Firestore);

  activeToasts: { id: number; type: 'wishlist' | 'cart' }[] = [];
  private toastIdCounter = 0;

  isLoading = true;
  hasError  = false;
  products: PromotionProduct[] = [];

  async ngOnInit(): Promise<void> {
    try {
      const q        = query(collection(this.firestore, 'products'), where('section', '==', 'PROMOTIONS'));
      const snapshot = await getDocs(q);
      const userId   = this.authService.userUID;

      this.products = await Promise.all(snapshot.docs.map(async docSnap => {
        const d            = docSnap.data();
        const productId    = docSnap.id;
        const rawPrice     = Number(d['price']        ?? 0);
        const initialPrice = Number(d['initialPrice'] ?? 0);
        const isDiscounted = d['isDiscounted']        ?? false;
        const stockCount   = Number(d['stockCount']   ?? 0);
        const rating       = Number(d['rating']       ?? 0);
        const isWishlisted = userId ? await this.wishlistService.isInWishlist(userId, productId) : false;

        return {
          productId,
          title:         d['title']   ?? 'Untitled',
          desc:          `${d['color'] ?? ''}${d['size'] ? ' · ' + d['size'] + ' ' + (d['unit'] ?? '') : ''}`.trim(),
          currentPrice:  `R ${rawPrice.toFixed(2)}`,
          originalPrice: isDiscounted && initialPrice ? `R ${initialPrice.toFixed(2)}` : '',
          stock:         d['inStock'] ? `In Stock (${stockCount})` : 'Out Of Stock',
          inStock:       d['inStock'] ?? false,
          stockCount,
          img:           d['imageUrl']  ?? '',
          stars:         this.buildStars(rating),
          isWishlisted,
          rawPrice,
          initialPrice,
          isDiscounted,
          rating,
          section:       d['section'] ?? '',
          color:         d['color']   ?? '',
          size:          Number(d['size'] ?? 0),
          unit:          d['unit']    ?? ''
        };
      }));
    } catch (error) {
      console.error('[PromotionsItemsTile] Failed to load products:', error);
      this.hasError = true;
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  private buildStars(rating: number): number[] {
    const stars: number[] = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i)            stars.push(1);
      else if (rating >= i - 0.5) stars.push(0.5);
      else                        stars.push(0);
    }
    return stars;
  }

  protected async addToCart(product: PromotionProduct, event: Event): Promise<void> {
    event.stopPropagation();
    if (!this.authService.isLoggedIn) { this.authService.router.navigate(['/login']); return; }
    try {
      await this.cartService.addToCart(this.authService.userUID!, {
        productId:    product.productId,
        name:         product.title,
        price:        product.rawPrice,
        initialPrice: product.initialPrice,
        isDiscounted: product.isDiscounted,
        image:        product.img,
        rating:       product.rating,
        inStock:      product.inStock,
        stockCount:   product.stockCount,
        section:      product.section,
        color:        product.color,
        size:         product.size,
        unit:         product.unit
      });
      this.triggerToast('cart');
    } catch (err) { console.error('[PromotionsItemsTile] Failed to add to cart:', err); }
  }

  protected async toggleWishlist(product: PromotionProduct, event: Event): Promise<void> {
    event.stopPropagation();
    if (!this.authService.isLoggedIn) { this.authService.router.navigate(['/login']); return; }
    try {
      const nowInWishlist = await this.wishlistService.toggleWishlist(this.authService.userUID!, {
        productId:    product.productId,
        name:         product.title,
        price:        product.rawPrice,
        initialPrice: product.initialPrice,
        isDiscounted: product.isDiscounted,
        image:        product.img,
        rating:       product.rating,
        inStock:      product.inStock,
        stockCount:   product.stockCount,
        section:      product.section,
        color:        product.color,
        size:         product.size,
        unit:         product.unit
      });
      product.isWishlisted = nowInWishlist;
      this.cdr.detectChanges();
      if (nowInWishlist) this.triggerToast('wishlist');
    } catch (err) { console.error('[PromotionsItemsTile] Failed to toggle wishlist:', err); }
  }

  protected onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'name-asc')        this.products.sort((a, b) => a.title.localeCompare(b.title));
    else if (value === 'price-asc')  this.products.sort((a, b) => a.rawPrice - b.rawPrice);
    else if (value === 'price-desc') this.products.sort((a, b) => b.rawPrice - a.rawPrice);
    this.cdr.detectChanges();
  }

  private triggerToast(type: 'wishlist' | 'cart'): void {
    const currentId = ++this.toastIdCounter;
    this.activeToasts.push({ id: currentId, type });
    this.cdr.detectChanges();
    setTimeout(() => { this.activeToasts = this.activeToasts.filter(t => t.id !== currentId); this.cdr.detectChanges(); }, 1500);
  }
}