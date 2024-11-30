import CardProduct from "@/components/ui/cardProduct";

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
