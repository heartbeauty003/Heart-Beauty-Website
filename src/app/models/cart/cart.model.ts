export interface CartModel {
  productId:    string;
  name:         string;
  price:        number;
  initialPrice: number;
  isDiscounted: boolean;
  image:        string;
  quantity:     number;
  addedAt:      string;
  rating:       number;
  inStock:      boolean;
  stockCount:   number;
  section:      string;
  color?:       string;
  size?:        number;
  unit?:        string;
}