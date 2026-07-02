import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  CollectionReference,
  DocumentData
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Product {
  id: string;
  title: string;
  price: number;
  initialPrice: number;
  imageUrl: string;
  inStock: boolean;
  isDiscounted: boolean;
  rating: number;
  section: string;
  size: number;
  stockCount: number;
  unit: string;
  color?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private firestore = inject(Firestore);

  private allProducts: Product[] = [];
  private productsLoaded = false;

  private _searchResults = new BehaviorSubject<Product[]>([]);
  private _isLoading = new BehaviorSubject<boolean>(false);

  searchResults$: Observable<Product[]> = this._searchResults.asObservable();
  isLoading$: Observable<boolean> = this._isLoading.asObservable();

  constructor() {
    this.loadAllProducts();
  }

  private async loadAllProducts(): Promise<void> {
    try {
      const ref = collection(this.firestore, 'products') as CollectionReference<DocumentData>;
      const snapshot = await getDocs(ref);
      this.allProducts = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          title: d['title'] ?? '',
          price: d['price'] ?? 0,
          initialPrice: d['initialPrice'] ?? 0,
          imageUrl: d['imageUrl'] ?? '',
          inStock: d['inStock'] ?? false,
          isDiscounted: d['isDiscounted'] ?? false,
          rating: d['rating'] ?? 0,
          section: d['section'] ?? '',
          size: d['size'] ?? 0,
          stockCount: d['stockCount'] ?? 0,
          unit: d['unit'] ?? '',
          color: d['color'] ?? undefined,
        };
      });
      this.productsLoaded = true;
    } catch (err) {
      console.error('[SearchService] Failed to load products:', err);
    }
  }

  search(term: string): void {
    const q = term.trim().toLowerCase();

    if (!q) {
      this._searchResults.next([]);
      return;
    }

    if (!this.productsLoaded) {
      setTimeout(() => this.search(term), 400);
      return;
    }

    const matches = this.allProducts.filter(p =>
      p.title.toLowerCase().includes(q)
    );

    this._searchResults.next(matches.slice(0, 10));
  }

  clear(): void {
    this._searchResults.next([]);
  }
}