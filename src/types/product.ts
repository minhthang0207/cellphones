// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  origin: string;
  description: string;
  slug: string;
  category_id: string;
  brand_id: string;
  average_rating?: number;
  ratings_count?: number;
  createdAt?: string;
  updatedAt?: string;
  Brand?: Brand_Product;
  Product_Category?: Category_Product;
}

interface Brand_Product {
  id: string;
  slug: string;
}

interface Category_Product {
  id: string;
  name: string;
  slug: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Product_Image {
  id: string;
  url: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Variant_Product {
  id: string;
  name: string;
  stock_quantity: number;
  price: number;
  slug: string;
  color_id: string;
  ram_id: string;
  rom_id: string;
  product_id: string;
  createdAt: string;
  updatedAt: string;
  Color: Color;
  Ram: Ram;
  Rom: Rom;
}
