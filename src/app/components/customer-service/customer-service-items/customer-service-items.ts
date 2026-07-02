import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-service-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-service-items.html',
  styleUrl: './customer-service-items.css',
})
export class CustomerServiceItems {
  isOpen = false;

  sidebarItems = [
    { id: 'overview', title: 'Customer Service Overview' },
    { id: 'how-to-buy', title: 'How To Buy Hair Online' },
    { id: 'payment', title: 'Payment Process' },
    { id: 'loyalty', title: 'Loyalty Points System' },
    { id: 'contact', title: 'Contacting Customer Service' },
    { id: 'notice', title: 'Important Notice' },
    { id: 'statement', title: 'Final Statement' }
  ];

  toggleMobile(): void {
    this.isOpen = !this.isOpen;
  }

  scrollToSection(id: string, event: Event): void {
    // 1. Stop Angular Router hijack
    event.preventDefault(); 

    const element = document.getElementById(id);
    if (element) {
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile) {
        // 2. Measure active heights right before closing to lock the coordinate vector
        const sidebarElement = document.querySelector('.customer-sidebar');
        const sidebarHeight = sidebarElement ? sidebarElement.getBoundingClientRect().height : 0;

        // 3. Initiate collapse instantly
        this.isOpen = false; 

        // 4. Run real-time calculation adjusting for layout shift
        const mobileHeaderOffset = 120; 
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - sidebarHeight - mobileHeaderOffset;

        // 5. Fire parallel smooth scroll
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        // Desktop smooth execution
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