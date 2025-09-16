export interface CartItem {
  id: string;
  quantity: number;
  user_id: string;
  variant_id: string;
  createdAt: string;
  updatedAt: string;
  Variant: Variant_Product;
}

export interface ItemCheckout {
  variant_id: string;
  quantity: number;
  price: number;
  image_url: string;
  name: string;
  stock_quantity: number;
}

export interface CartState {
  cart: CartItem[];
  fetchCart: (userId: string) => Promise<void>;
  addToCart: (
    userId: string,
    item: Variant_Product
  ) => Promise<{ success: boolean; message: string }>;
  updateCart: (
    itemId: string,
    quantity: number
  ) => Promise<{ success: boolean; message: string }>;
  deleteCart: (
    itemId: string
  ) => Promise<{ success: boolean; message: string }>;
}
