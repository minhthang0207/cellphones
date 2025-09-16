interface WishListItem {
  id: string;
  user_id: string;
  product_id: string;
  createdAt: string;
  updatedAt: string;
  Product: Product;
}

export interface WishListState {
  wishlist: WishListItem[];
  fetchWishList: (userId: string) => Promise<void>;
  addToWishList: (
    userId: string,
    item: Product
  ) => Promise<{ success: boolean; message: string }>;
  deleteWishList: (
    itemId: string
  ) => Promise<{ success: boolean; message: string }>;
}
