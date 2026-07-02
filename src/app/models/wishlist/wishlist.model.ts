export interface WishlistModel {
  productId:    string;
  name:         string;
  price:        number;
  initialPrice: number;
  isDiscounted: boolean;
  image:        string;
  addedAt:      string;
  rating:       number;
  inStock:      boolean;
  stockCount:   number;
  section:      string;
  color?:       string;
  size?:        number;
  unit?:        string;
}