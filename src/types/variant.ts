// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Variant {
  id: string;
  name: string; // Đường dẫn đến hình ảnh sản phẩm
  stock_quantity: number; // Tên của sản phẩm
  price: number; // Giá của sản phẩm
  slug?: string; // Số sao đánh giá sản phẩm
  color_id: string; // Số lượng đánh giá
  ram_id: string;
  rom_id: string;
  product_id: string;
  createdAt?: string;
  updatedAt?: string;
  Color: ColorVariant;
  Ram: RamVariant;
  Rom: RomVariant;
}

interface ColorVariant {
  id: string;
  name: string;
}

interface RamVariant {
  id: string;
  capacity: number;
}

interface RomVariant {
  id: string;
  capacity: number;
}
