import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegalItems } from '../../components/legal/legal-items/legal-items';
import { LegalInfo } from '../../components/legal/legal-info/legal-info';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [CommonModule, LegalItems, LegalInfo],
  templateUrl: './legal.html',
  styleUrl: './legal.css',
})
export class Legal {
  // Let Angular and CSS handle everything.
}