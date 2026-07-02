import { Component } from '@angular/core';
import { Banner } from '../../components/home/banner/banner'; // Banner sorted - after refactor
import { ProductsHighlightTile } from '../../components/home/products-highlight-tile/products-highlight-tile';
import { BestSellersTile } from '../../components/home/best-sellers-tile/best-sellers-tile'; // BestSellersTile sorted - after refactor
import { MarketingTile } from '../../components/home/marketing-tile/marketing-tile'; // MarketingTile sorted - after refactor
import { SaleItemsTile } from '../../components/home/sale-items-tile/sale-items-tile'; // SaleItemsTile sorted - after refactor
import { CustomerReviewsTile } from '../../components/home/customer-reviews-tile/customer-reviews-tile'; // CustomerReviewsTile sorted - after refactor
import { LoyaltyTile } from '../../components/home/loyalty-tile/loyalty-tile'; // LoyaltyTile sorted - after refactor
import { AboutTile } from '../../components/home/about-tile/about-tile'; // AboutTile imported here
import { CallToActionTile } from '../../components/home/call-to-action-tile/call-to-action-tile';
import { FeatureHighlightTile } from '../../components/home/feature-highlight-tile/feature-highlight-tile';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Banner, 
    ProductsHighlightTile,
    BestSellersTile, 
    MarketingTile, 
    SaleItemsTile, 
    FeatureHighlightTile,
    CustomerReviewsTile, 
    LoyaltyTile, 
    AboutTile,
    CallToActionTile
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // Home view container hosting page-specific modules like the top banner
}