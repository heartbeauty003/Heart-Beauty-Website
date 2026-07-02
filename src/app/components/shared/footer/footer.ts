import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NewsletterService } from '../../../services/newsletter/newsletter.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private newsletterService = new NewsletterService();
  private cdr = inject(ChangeDetectorRef);

  openSections: { [key: string]: boolean } = {
    navigation: false,
    customer: false,
    legal: false,
    joinus: false,
  };

  newsletterEmail = '';
  isSubscribing = false;
  subscribeSuccess = false;
  subscribeError: string | null = null;

  toggleSection(section: string): void {
    this.openSections[section] = !this.openSections[section];
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }

  async onSubscribe(): Promise<void> {
    if (!this.newsletterEmail || this.isSubscribing) return;

    this.isSubscribing = true;
    this.subscribeSuccess = false;
    this.subscribeError = null;
    this.cdr.detectChanges();

    try {
      await this.newsletterService.subscribeToNewsletter(this.newsletterEmail);
      this.subscribeSuccess = true;
      this.newsletterEmail = '';
    } catch (err: any) {
      this.subscribeError = err?.message ?? 'Subscription failed. Please try again.';
    } finally {
      this.isSubscribing = false;
      this.cdr.detectChanges();
    }
  }
}