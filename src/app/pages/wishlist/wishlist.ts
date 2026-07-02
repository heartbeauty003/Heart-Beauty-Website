import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistListItems } from '../../components/wishlist/wishlist-list-items/wishlist-list-items';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, WishlistListItems],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist {}