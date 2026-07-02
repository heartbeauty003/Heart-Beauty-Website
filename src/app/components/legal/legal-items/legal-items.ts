import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-legal-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legal-items.html',
  styleUrl: './legal-items.css',
})
export class LegalItems {
  isOpen = false;

  sidebarItems = [
    { id: 'general', title: 'General Policies' },
    { id: 'terms', title: 'Terms Of Service' },
    { id: 'returns', title: 'Return Policy' },
    { id: 'refunds', title: 'Refund Policy' },
    { id: 'delivery', title: 'Delivery Policy' },
    { id: 'privacy', title: 'Privacy Policy' }
  ];

  toggleMobile(): void {
    this.isOpen = !this.isOpen;
  }

  scrollToSection(id: string, event: Event): void {
    // 1. Stop Angular router routing
    event.preventDefault(); 

    const element = document.getElementById(id);
    if (element) {
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile) {
        // 2. Measure the exact height the open menu is occupying right now
        const sidebarElement = document.querySelector('.sidebar');
        const sidebarHeight = sidebarElement ? sidebarElement.getBoundingClientRect().height : 0;

        // 3. Close the menu immediately to kick off the CSS slide-up transition
        this.isOpen = false; 

        // 4. Calculate where the heading WILL be after the menu shrinks to 0px
        const mobileHeaderOffset = 120; 
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - sidebarHeight - mobileHeaderOffset;

        // 5. Fire the scroll instantly alongside the closing menu animation
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        // Desktop execution remains snappy and simple
        const desktopHeaderOffset = 220;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - desktopHeaderOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }
}