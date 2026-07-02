import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-products-highlight-tile',
  standalone: true,
  imports: [],
  templateUrl: './products-highlight-tile.html',
  styleUrl: './products-highlight-tile.css',
})
export class ProductsHighlightTile {
  @ViewChild('productsList') productsList!: ElementRef;

  scrollProgress: number = 0;

  selectedImageSrc: string | null = null;
  selectedImageAlt: string = '';

  openModal(src: string, alt: string): void {
    this.selectedImageSrc = src;
    this.selectedImageAlt = alt;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedImageSrc = null;
    this.selectedImageAlt = '';
    document.body.style.overflow = '';
  }

  // Calculates the scroll percentage for the progress bar
  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const scrollLeft = target.scrollLeft;
    const maxScroll = target.scrollWidth - target.clientWidth;
    this.scrollProgress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
  }

  // Dynamically calculates scroll distance based on the first item width + gap
  private getScrollDistance(): number {
    if (!this.productsList) {
      return 300;
    }
    const container = this.productsList.nativeElement;
    const firstItem = container.querySelector('.product-item') as HTMLElement;
    if (firstItem) {
      // Item width plus the flex gap (16px)
      return firstItem.clientWidth + 16;
    }
    return container.clientWidth * 0.8;
  }

  // Scrolls left when the chevron is clicked
  scrollLeft(): void {
    if (this.productsList) {
      const element = this.productsList.nativeElement;
      element.scrollBy({ left: -this.getScrollDistance(), behavior: 'smooth' });
    }
  }

  // Scrolls right when the chevron is clicked
  scrollRight(): void {
    if (this.productsList) {
      const element = this.productsList.nativeElement;
      element.scrollBy({ left: this.getScrollDistance(), behavior: 'smooth' });
    }
  }
}