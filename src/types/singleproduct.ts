interface Color {
  id: string;
  name: string;
  slug: string;
  code: string;
}

interface RAM {
  id: string;
  name: string;
  slug: string;
}

interface ROM {
  id: string;
  name: string;
  slug: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface SingleProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  category_slug: string;
  product_slug: string;
  price: number;
  gallery_image: string[];
  description: string;
  colors: Color[];
  ram: RAM[];
  rom: ROM[];
  star: number;
  num_review: number;
  defaultVariant: Variant;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Variant {
  id: string;
  name: string;
  color_slug: string;
  rom_slug: string;
  stock_quantity: number;
  price: number;
  image: string;
}
