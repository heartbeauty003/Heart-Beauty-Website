import { Component, ElementRef, ViewChild, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Firestore, collection, query, where, limit, getDocs } from '@angular/fire/firestore';
import { AuthService } from '../../../services/auth';
import { CartService } from '../../../services/cart/cart.service';
import { WishlistService } from '../../../services/wishlist/wishlist.service';

interface BestSellerProduct {
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
  isNew:        boolean;
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
  selector: 'app-best-sellers-tile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './best-sellers-tile.html',
  styleUrl: './best-sellers-tile.css',
})
export class BestSellersTile implements OnInit {
  @ViewChild('carouselViewport', { static: false }) carouselViewport!: ElementRef<HTMLDivElement>;

  private authService     = inject(AuthService);
  private cartService     = inject(CartService);
  private wishlistService = inject(WishlistService);
  private cdr             = inject(ChangeDetectorRef);
  private firestore       = inject(Firestore);

  activeToasts: { id: number; type: 'wishlist' | 'cart' }[] = [];
  private toastIdCounter = 0;

  isLoading = true;
  hasError  = false;
  products: BestSellerProduct[] = [];

  async ngOnInit(): Promise<void> {
    try {
      const q        = query(collection(this.firestore, 'products'), where('section', '==', 'TRENDING_NOW'), limit(5));
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
          isNew:         false,
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
      console.error('[BestSellersTile] Failed to load products:', error);
      this.hasError = true;
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  private buildStars(rating: number): number[] {
    return [1, 2, 3, 4, 5].map(i => {
      if (i <= Math.floor(rating)) return 1;
      if (i === Math.ceil(rating) && rating % 1 >= 0.5) return 0.5;
      return 0;
    });
  }

  protected scrollCarousel(direction: 'left' | 'right'): void {
    if (!this.carouselViewport) return;
    const container = this.carouselViewport.nativeElement;
    container.scrollBy({ left: direction === 'left' ? -(container.clientWidth * 0.75) : container.clientWidth * 0.75, behavior: 'smooth' });
  }

  protected async addToCart(product: BestSellerProduct, event: Event): Promise<void> {
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
    } catch (err) { console.error('[BestSellersTile] Failed to add to cart:', err); }
  }

  protected async toggleWishlist(product: BestSellerProduct, event: Event): Promise<void> {
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
    } catch (err) { console.error('[BestSellersTile] Failed to toggle wishlist:', err); }
  }

  private triggerToast(type: 'wishlist' | 'cart'): void {
    const currentId = ++this.toastIdCounter;
    this.activeToasts.push({ id: currentId, type });
    this.cdr.detectChanges();
    setTimeout(() => { this.activeToasts = this.activeToasts.filter(t => t.id !== currentId); this.cdr.detectChanges(); }, 1500);
  }
}