import { Component } from '@angular/core';
import { PromotionsBanner } from '../../components/promotions/promotions-banner/promotions-banner';
import { PromotionsItemsTile } from '../../components/promotions/promotions-items-tile/promotions-items-tile';

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [
    PromotionsBanner,
    PromotionsItemsTile
  ],
  templateUrl: './promotions.html',
  styleUrl: './promotions.css',
})
export class Promotions {}