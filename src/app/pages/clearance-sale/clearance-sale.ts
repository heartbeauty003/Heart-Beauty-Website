import { Component } from '@angular/core';
import { ClearanceSaleBanner } from '../../components/clearance-sale/clearance-sale-banner/clearance-sale-banner';
import { ClearanceSaleItemsTile } from '../../components/clearance-sale/clearance-sale-items-tile/clearance-sale-items-tile';

@Component({
  selector: 'app-clearance-sale',
  standalone: true,
  imports: [ClearanceSaleBanner, ClearanceSaleItemsTile],
  templateUrl: './clearance-sale.html',
  styleUrl: './clearance-sale.css',
})
export class ClearanceSale {}