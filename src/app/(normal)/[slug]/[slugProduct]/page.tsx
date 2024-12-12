import SingleProductForm from "@/components/organisms/ListProductCategory/DetailSingleProduct/SingleProductForm";
import { redirect } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getProduct(slugProduct: string) {
  const product = {
    id: "123",
    name: "Laptop XYZ",
    slug: "sanpham1",
    category: "Laptop",
    image: "/product_1.jpg",
    category_slug: "laptop",
    product_slug: "maytinh1",
    price: 10000000,
    gallery_image: [
      "/product_1.jpg",
      "/product_2.jpg",
      "/product_3.jpg",
      "/product_4.jpg",
      "/product_5.jpg",
      "/product_6.jpg",
      "/product_1.jpg",
      "/product_2.jpg",
    ],
    description:
      "laptop1 trông rất xin đấy nha, sản phẩm mới về được nhiều người ưa chuộng",
    colors: [
      { id: "1", name: "Đen", slug: "den", code: "#000000" },
      { id: "2", name: "Xám", slug: "xam", code: "#808080" },
      { id: "3", name: "Trắng", slug: "trang", code: "#FFFFFF" },
    ],
    ram: [
      { id: "1", name: "8GB", slug: "8gb" },
      { id: "2", name: "16GB", slug: "16gb" },
      { id: "3", name: "32GB", slug: "32gb" },
    ],
    rom: [
      { id: "1", name: "256GB", slug: "256gb" },
      { id: "2", name: "512GB", slug: "512gb" },
      { id: "3", name: "1TB", slug: "1tb" },
    ],
    star: 4,
    num_review: 10,
    defaultVariant: {
      id: "1",
      name: "Laptop XYZ đen dung lượng 8GB",
      color_slug: "den",
      rom_slug: "256gb",
      stock_quantity: 60,
      price: 15000000,
      image: "/product_1.jpg",
    },
  };

  return product;
}

// Component hiển thị sản phẩm
const SingleProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string; slugProduct: string }>;
}) => {
  const { slug, slugProduct } = await params;

  // Lấy dữ liệu sản phẩm từ hàm getProduct
  const product = await getProduct(slugProduct);

  // Kiểm tra nếu sản phẩm không tồn tại hoặc slug không khớp
  if (!product || product.category_slug !== slug) {
    redirect("/error"); // Redirect nếu không tìm thấy sản phẩm hoặc slug không khớp
  }

  return <SingleProductForm product={product} />;
};

export default SingleProductPage;
