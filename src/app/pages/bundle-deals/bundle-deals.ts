import { Component } from '@angular/core';
import { BundleDealsBanner } from '../../components/bundle-deals/bundle-deals-banner/bundle-deals-banner';
import { BundleDealsItemsTile } from '../../components/bundle-deals/bundle-deals-items-tile/bundle-deals-items-tile';

@Component({
  selector: 'app-bundle-deals',
  standalone: true,
  imports: [BundleDealsBanner, BundleDealsItemsTile],
  templateUrl: './bundle-deals.html',
  styleUrl: './bundle-deals.css',
})
export class BundleDeals {}