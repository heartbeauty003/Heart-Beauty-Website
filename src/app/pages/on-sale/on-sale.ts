import { Component } from '@angular/core';
import { OnSaleBanner } from '../../components/on-sale/on-sale-banner/on-sale-banner';
import { SaleItemsTile } from '../../components/on-sale/sale-items-tile/sale-items-tile';

@Component({
  selector: 'app-on-sale',
  standalone: true,
  imports: [OnSaleBanner, SaleItemsTile],
  templateUrl: './on-sale.html',
  styleUrl: './on-sale.css',
})
export class OnSale {}


