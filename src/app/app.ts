import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Navbar } from './components/shared/navbar/navbar';
import { Assistant } from './components/shared/assistant/assistant';
import { Footer } from './components/shared/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Assistant, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('heart-beauty-web-site');
  protected readonly isAuthPage = signal(false);

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects;
        
        // 1. Determine if we are visiting an auth route layout
        const authRoutes = ['/login', '/register', '/reset-password'];
        const isAuth = authRoutes.some(route => currentUrl.includes(route));
        this.isAuthPage.set(isAuth);

        // 2. Parse the outgoing redirect URL structure for fragments
        const urlTree = this.router.parseUrl(currentUrl);
        const fragment = urlTree.fragment;
        
        if (fragment) {
          // If a fragment exists (like #returns), wait for the component to render 
          // then let native CSS scroll-margin-top handle the exact alignment.
          setTimeout(() => {
            const element = document.getElementById(fragment);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        } else {
          // For all normal navigation (no fragment), force scroll back to the very top.
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    });
  }
}