import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [], 
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class Gallery {
  @ViewChild('galleryList') galleryList!: ElementRef;
  
  selectedImageSrc: string | null = null;
  selectedImageAlt: string = '';
  scrollProgress: number = 0;

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

  // Scrolls left when the chevron is clicked
  scrollLeft(): void {
    if (this.galleryList) {
      const element = this.galleryList.nativeElement;
      // Scrolls exactly one image width backward
      element.scrollBy({ left: -(element.clientWidth * 0.85 + 16), behavior: 'smooth' });
    }
  }

  // Scrolls right when the chevron is clicked
  scrollRight(): void {
    if (this.galleryList) {
      const element = this.galleryList.nativeElement;
      // Scrolls exactly one image width forward
      element.scrollBy({ left: element.clientWidth * 0.85 + 16, behavior: 'smooth' });
    }
  }
}