import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDoc,
  query,
  orderBy,
  onSnapshot
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { WishlistModel } from '../../models/wishlist/wishlist.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private firestore = inject(Firestore);

  private parentRef(userId: string) {
    return doc(this.firestore, 'wishlists', userId);
  }

  private itemRef(userId: string, productId: string) {
    return doc(this.firestore, 'wishlists', userId, 'items', productId);
  }

  private async ensureParentDoc(userId: string): Promise<void> {
    const parent = this.parentRef(userId);
    const snap   = await getDoc(parent);
    if (!snap.exists()) {
      await setDoc(parent, { userId, createdAt: new Date().toISOString() });
    }
  }

  getWishlistItems(userId: string): Observable<WishlistModel[]> {
    return new Observable<WishlistModel[]>((subscriber) => {
      try {
        const colRef = collection(this.firestore, 'wishlists', userId, 'items');
        const q      = query(colRef, orderBy('addedAt', 'desc'));

        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const items: WishlistModel[] = [];
            snapshot.forEach((docSnap) => {
              items.push({
                productId: docSnap.id,
                ...(docSnap.data() as Omit<WishlistModel, 'productId'>)
              });
            });
            console.log(`[WishlistService] Successfully fetched ${items.length} items for user ${userId}`, items);
            subscriber.next(items);
          },
          (error) => {
            console.error('[WishlistService] Native Snapshot Error:', error);
            subscriber.next([]);
          }
        );

        return () => unsubscribe();
      } catch (err) {
        console.error('[WishlistService] Structural error setting up stream:', err);
        subscriber.next([]);
        return () => {};
      }
    });
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const snap = await getDoc(this.itemRef(userId, productId));
    return snap.exists();
  }

  async addToWishlist(userId: string, item: Omit<WishlistModel, 'addedAt'>): Promise<void> {
    await this.ensureParentDoc(userId);

    const payload: WishlistModel = {
      productId:    item.productId,
      name:         item.name,
      price:        item.price,
      initialPrice: item.initialPrice,
      isDiscounted: item.isDiscounted,
      image:        item.image,
      addedAt:      new Date().toISOString(),
      rating:       item.rating,
      inStock:      item.inStock,
      stockCount:   item.stockCount,
      section:      item.section,
    };

    if (item.color !== undefined) payload.color = item.color;
    if (item.size  !== undefined) payload.size  = item.size;
    if (item.unit  !== undefined) payload.unit  = item.unit;

    await setDoc(this.itemRef(userId, item.productId), payload);
    console.log(`[WishlistService] Added ${item.productId} to wishlist of user ${userId}`);
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    await deleteDoc(this.itemRef(userId, productId));
    console.log(`[WishlistService] Removed ${productId} from wishlist of user ${userId}`);
  }

  async toggleWishlist(userId: string, item: Omit<WishlistModel, 'addedAt'>): Promise<boolean> {
    const inList = await this.isInWishlist(userId, item.productId);
    if (inList) {
      await this.removeFromWishlist(userId, item.productId);
      return false;
    } else {
      await this.addToWishlist(userId, item);
      return true;
    }
  }
}