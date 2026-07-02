import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-tile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about-tile.html',
  styleUrl: './about-tile.css',
})
export class AboutTile {}