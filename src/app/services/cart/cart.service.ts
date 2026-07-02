import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  deleteDoc,
  collection,
  updateDoc,
  increment,
  getDoc,
  query,
  orderBy,
  onSnapshot
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CartModel } from '../../models/cart/cart.model';

export type CartItem = CartModel;

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private firestore = inject(Firestore);

  private parentRef(userId: string) {
    return doc(this.firestore, 'carts', userId);
  }

  private itemRef(userId: string, productId: string) {
    return doc(this.firestore, 'carts', userId, 'items', productId);
  }

  private async ensureParentDoc(userId: string): Promise<void> {
    const parent = this.parentRef(userId);
    const snap   = await getDoc(parent);
    if (!snap.exists()) {
      await setDoc(parent, { userId, createdAt: new Date().toISOString() });
    }
  }

  getCartItems(userId: string): Observable<CartModel[]> {
    return new Observable<CartModel[]>((subscriber) => {
      try {
        const colRef = collection(this.firestore, 'carts', userId, 'items');
        const q      = query(colRef, orderBy('addedAt', 'desc'));

        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const items: CartModel[] = [];
            snapshot.forEach((docSnap) => {
              items.push({
                productId: docSnap.id,
                ...(docSnap.data() as Omit<CartModel, 'productId'>)
              });
            });
            console.log(`[CartService] Fetched ${items.length} items for user ${userId}`);
            subscriber.next(items);
          },
          (error) => {
            console.error('[CartService] Snapshot error:', error);
            subscriber.next([]);
          }
        );

        return () => unsubscribe();
      } catch (err) {
        console.error('[CartService] Error setting up stream:', err);
        subscriber.next([]);
        return () => {};
      }
    });
  }

  async addToCart(
    userId: string,
    item: Omit<CartModel, 'addedAt' | 'quantity'>,
    quantity = 1
  ): Promise<void> {
    await this.ensureParentDoc(userId);
    const ref = this.itemRef(userId, item.productId);

    const payload: any = {
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
      quantity:     increment(quantity),
      addedAt:      new Date().toISOString()
    };

    if (item.color !== undefined) payload.color = item.color;
    if (item.size  !== undefined) payload.size  = item.size;
    if (item.unit  !== undefined) payload.unit  = item.unit;

    await setDoc(ref, payload, { merge: true });
    console.log(`[CartService] Added/incremented ${item.productId} for user ${userId}`);
  }

  async updateQuantity(userId: string, productId: string, quantity: number): Promise<void> {
    if (quantity < 1) return this.removeFromCart(userId, productId);
    await updateDoc(this.itemRef(userId, productId), { quantity });
  }

  async removeFromCart(userId: string, productId: string): Promise<void> {
    await deleteDoc(this.itemRef(userId, productId));
  }

  async clearCart(userId: string, productIds: string[]): Promise<void> {
    const deletes = productIds.map(id => deleteDoc(this.itemRef(userId, id)));
    await Promise.all(deletes);
  }
}