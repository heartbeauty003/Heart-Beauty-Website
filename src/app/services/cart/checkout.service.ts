import { Injectable } from '@angular/core';
import { CheckoutModel } from '../../models/cart/checkout.model';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private waNumber = '27740143618';
  private emailAddress = 'heartbeauty003@gmail.com';

  checkoutViaWhatsApp(items: CheckoutModel[]): void {
    if (!items || items.length === 0) return;

    let message = `Hello Heart Beauty Team\n\n`;
    message += `I would like to place an order for the following item(s):\n\n`;
    message += `${'─'.repeat(30)}\n\n`;

    items.forEach((item, index) => {
      message += `Item ${index + 1}: ${item.title}\n`;
      message += `${'─'.repeat(20)}\n`;

      message += `  - Colour: ${item.color ?? 'N/A'}\n`;

      if (item.size !== undefined && item.size !== null && item.unit) {
        message += `  - Size: ${item.size} ${item.unit}\n`;
      } else if (item.size !== undefined && item.size !== null) {
        message += `  - Size: ${item.size}\n`;
      } else {
        message += `  - Size: N/A\n`;
      }

      message += `  - Quantity: ${item.quantity}\n`;
      message += `\n`;
    });

    message += `${'─'.repeat(30)}\n`;
    message += `Please confirm availability and provide payment instructions.\n\n`;
    message += `Thank you`;

    const url = `https://wa.me/${this.waNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  generateQuoteEmail(items: CheckoutModel[]): void {
    if (!items || items.length === 0) return;

    let body = `Hello Heart Beauty Team,\n\n`;
    body += `I would like to request a formal quotation and check availability for the following items:\n\n`;
    body += `${'='.repeat(40)}\n\n`;

    items.forEach((item, index) => {
      body += `Item ${index + 1}: ${item.title}\n`;
      body += `${'-'.repeat(30)}\n`;

      body += `  - Colour:   ${item.color ?? 'N/A'}\n`;

      if (item.size !== undefined && item.size !== null && item.unit) {
        body += `  - Size:     ${item.size} ${item.unit}\n`;
      } else if (item.size !== undefined && item.size !== null) {
        body += `  - Size:     ${item.size}\n`;
      } else {
        body += `  - Size:     N/A\n`;
      }

      body += `  - Quantity: ${item.quantity}\n`;
      body += `\n`;
    });

    body += `${'='.repeat(40)}\n\n`;
    body += `Please confirm availability and provide payment instructions.\n\n`;
    body += `Thank you,\n`;
    body += `Heart Beauty Customer`;

    const subject = encodeURIComponent('Order / Quote Request - Heart Beauty');
    const encodedBody = encodeURIComponent(body);

    window.location.href = `mailto:${this.emailAddress}?subject=${subject}&body=${encodedBody}`;
  }
}