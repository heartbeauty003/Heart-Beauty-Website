import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { OnSale } from './pages/on-sale/on-sale';
import { BundleDeals } from './pages/bundle-deals/bundle-deals';
import { ClearanceSale } from './pages/clearance-sale/clearance-sale';
import { TrendingNow } from './pages/trending-now/trending-now';
import { Promotions } from './pages/promotions/promotions';
import { WhyUs } from './pages/why-us/why-us';
import { Loyalty } from './pages/loyalty/loyalty';
import { Legal } from './pages/legal/legal';
import { CustomerService } from './pages/customer-service/customer-service';
import { Support } from './pages/support/support';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { ResetPassword } from './pages/auth/reset-password/reset-password';
import { Cart } from './pages/cart/cart';
import { Profile } from './pages/profile/profile';
import { Wishlist } from './pages/wishlist/wishlist';
import { AboutUs } from './pages/about-us/about-us';
import { Notifications } from './pages/notifications/notifications';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'on-sale', component: OnSale },
  { path: 'bundle-deals', component: BundleDeals },
  { path: 'clearance-sale', component: ClearanceSale },
  { path: 'trending-now', component: TrendingNow },
  { path: 'promotions', component: Promotions },
  { path: 'about-us', component: AboutUs },
  { path: 'why-us', component: WhyUs },
  { path: 'loyalty', component: Loyalty, canActivate: [authGuard] },
  { path: 'legal', component: Legal },
  { path: 'customer-service', component: CustomerService },
  { path: 'support', component: Support },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  { path: 'reset-password', component: ResetPassword, canActivate: [guestGuard] },
  { path: 'cart', component: Cart, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'wishlist', component: Wishlist, canActivate: [authGuard] },
  { path: 'notifications', component: Notifications},
  { path: '**', redirectTo: '' }
];