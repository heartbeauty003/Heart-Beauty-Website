import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './banner.html',
  styleUrl: './banner.css'
})
export class Banner {
  // Pure structural web implementation mimicking desktop and mobile layout variants natively
}