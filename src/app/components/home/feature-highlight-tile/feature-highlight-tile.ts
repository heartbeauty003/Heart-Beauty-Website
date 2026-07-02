import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-feature-highlight-tile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './feature-highlight-tile.html',
  styleUrl: './feature-highlight-tile.css',
})
export class FeatureHighlightTile {

}