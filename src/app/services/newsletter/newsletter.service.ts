import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  private readonly endpoint = 'https://formspree.io/f/mqevareb';
  private firestore = inject(Firestore);

  async subscribeToNewsletter(email: string): Promise<void> {
    // 1. Send email via Formspree — throws on failure
    let formspreeResponse: Response;

    try {
      formspreeResponse = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email,
          message: 'Hi Heart Beauty, I would like to sign up for newsletter communication'
        })
      });
    } catch (err) {
      throw new Error('Unable to reach the subscription service. Please check your connection.');
    }

    if (!formspreeResponse.ok) {
      const data = await formspreeResponse.json().catch(() => ({}));
      throw new Error(data?.errors?.[0]?.message ?? 'Subscription failed. Please try again.');
    }

    // 2. Store subscriber in Firestore — throws on failure
    try {
      const subscribersRef = collection(this.firestore, 'newsletter_subscribers');
      await addDoc(subscribersRef, {
        email,
        subscribedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('[NewsletterService] Firestore write failed:', err);
      throw new Error('Subscription recorded but failed to save. Please try again.');
    }
  }
}