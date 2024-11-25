import CardProduct from "@/components/ui/cardProduct";

interface Product {
  img: string; // Đường dẫn đến hình ảnh sản phẩm
  name: string; // Tên của sản phẩm
  price: number; // Giá của sản phẩm
  link: string; // Đường dẫn đến trang sản phẩm
  star: number; // Số sao đánh giá sản phẩm
  num_review: number; // Số lượng đánh giá
}

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-5 gap-4">
      {products.map((item, index) => {
        return <CardProduct product={item} key={index} />;
      })}
    </div>
  );
};

export default ProductGrid;
