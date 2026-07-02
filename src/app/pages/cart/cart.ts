import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItems } from '../../components/cart/cart-items/cart-items';
import { OrderSummary } from '../../components/cart/order-summary/order-summary';
import { CartItem, CartService } from '../../services/cart/cart.service';
import { CheckoutModel } from '../../models/cart/checkout.model';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, CartItems, OrderSummary],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  cartItems: CartItem[] = [];
  showClearModal = signal(false);

  onItemsChanged(items: CartItem[]): void {
    this.cartItems = items;
  }

  getTotalItemCount(): number {
    return this.cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
  }

  calculateTotal(): number {
    return this.cartItems.reduce((acc, item) => acc + ((item.price || 0) * item.quantity), 0);
  }

  get checkoutItems(): CheckoutModel[] {
    return this.cartItems.map(item => ({
      id:       item.productId,
      title:    item.name,
      price:    item.price,
      quantity: item.quantity,
      section:  item.section,
      color:    item.color,
      size:     item.size,
      unit:     item.unit
    }));
  }

  // Called when WhatsApp/Email is triggered — just show the modal
  onCheckoutSuccess(): void {
    this.showClearModal.set(true);
  }

  // User confirmed — clear the cart
  confirmClearCart(): void {
    const userId     = this.authService.userUID;
    const productIds = this.cartItems.map(item => item.productId);
    if (!userId) return;
    this.cartService.clearCart(userId, productIds);
    this.showClearModal.set(false);
  }

  // User said no — just close the modal, cart stays
  dismissModal(): void {
    this.showClearModal.set(false);
  }
}