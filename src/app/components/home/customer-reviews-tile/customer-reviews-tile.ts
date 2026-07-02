import { Component, ElementRef, ViewChild, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, getDocs, orderBy, query } from '@angular/fire/firestore';

interface Review {
  name: string;
  rating: number;
  shortText: string;
  fullText: string;
  img: string;
}

@Component({
  selector: 'app-customer-reviews-tile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-reviews-tile.html',
  styleUrl: './customer-reviews-tile.css',
})
export class CustomerReviewsTile implements OnInit {
  @ViewChild('carouselViewport', { static: false }) carouselViewport!: ElementRef<HTMLDivElement>;

  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);

  selectedReview: any = null;
  reviews: Review[] = [];
  isLoading = true;

  async ngOnInit(): Promise<void> {
    try {
      const q = query(collection(this.firestore, 'reviews'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      this.reviews = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          name: data['reviewerName'] ?? 'Anonymous',
          rating: data['rating'] ?? 5,
          shortText: data['body'] ?? '',
          fullText: data['body'] ?? '',
          img: data['imageUrl'] ?? 'review-test-item.png',
        };
      });
    } catch (error) {
      console.error('[CustomerReviewsTile] Failed to load reviews:', error);
      this.reviews = [];
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges(); // Forces the UI to update once loading is done
    }
  }

  protected scrollCarousel(direction: 'left' | 'right'): void {
    if (!this.carouselViewport) return;
    const container = this.carouselViewport.nativeElement;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }

  protected openModal(review: any): void {
    this.selectedReview = review;
    document.body.style.overflow = 'hidden';
  }

  protected closeModal(): void {
    this.selectedReview = null;
    document.body.style.overflow = '';
  }
}