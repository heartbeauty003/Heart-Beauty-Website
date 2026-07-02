export interface CheckoutModel {
  id: string;
  title: string;
  price?: number;
  quantity: number;
  section?: string;
  color?: string;
  size?: number;
  unit?: string;
}