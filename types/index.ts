export interface Producer {
  id: string;
  name: string;
  photoUrl: string;
  bio: string;
  yearsExperience: number;
  contactEmail: string;
  whatsappNumber: string;
}

export type ProductCategory = 'frutas' | 'legumes' | 'verduras';
export type ProductUnit = 'unidade' | '100g' | 'kg';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  unit: ProductUnit;
  imageUrl: string;
  producerId: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderPayload {
  items: CartItem[];
  shippingAddress: string;
  shippingFee: number;
  subtotal: number;
  total: number;
  customerDetails?: { name: string; email: string };
}
