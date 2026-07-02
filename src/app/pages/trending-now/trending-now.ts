import { Component } from '@angular/core';
import { TrendingNowBanner } from '../../components/trending-now/trending-now-banner/trending-now-banner';
import { TrendingNowItemsTile } from '../../components/trending-now/trending-now-items-tile/trending-now-items-tile';

@Component({
  selector: 'app-trending-now',
  standalone: true,
  imports: [TrendingNowBanner, TrendingNowItemsTile],
  templateUrl: './trending-now.html',
  styleUrl: './trending-now.css',
})
export class TrendingNow {}