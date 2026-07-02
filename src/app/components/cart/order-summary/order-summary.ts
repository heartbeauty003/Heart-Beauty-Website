import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutService } from '../../../services/cart/checkout.service';
import { CheckoutModel } from '../../../models/cart/checkout.model';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.css'
})
export class OrderSummary {
  @Input() items: CheckoutModel[] = [];
  @Input() total: number = 0;
  @Input() totalItems: number = 0;

  @Output() checkoutComplete = new EventEmitter<void>();

  private checkoutService = inject(CheckoutService);

  onCheckout(): void {
    if (this.items.length === 0) return;

    // Send data to WhatsApp
    this.checkoutService.checkoutViaWhatsApp(this.items);

    // Emit event so the parent page knows to clear the cart
    this.checkoutComplete.emit();
  }

  onGenerateQuote(): void {
    if (this.items.length === 0) return;

    // Trigger the email client via the service
    this.checkoutService.generateQuoteEmail(this.items);

    // Emit event so the parent page knows to clear the cart
    this.checkoutComplete.emit();
  }
}