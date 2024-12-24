import CardProduct from "@/components/ui/cardProduct";
import { FaFireAlt } from "react-icons/fa";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import { useEffect, useState } from "react";
import Loading from "../Loading";

interface OutStandingProductProps {
  products: Product[];
  isLoading?: boolean;
}

const OutStandingProduct: React.FC<OutStandingProductProps> = ({
  products,
  isLoading,
}) => {
  const [windowWidth, setWindowWidth] = useState(0);

  // Cập nhật windowWidth khi kích thước màn hình thay đổi
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // Set initial width
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize); // Cleanup listener
  }, []);

  // Xác định số lượng sản phẩm cần hiển thị tùy thuộc vào kích thước màn hình
  const getItemsToShow = () => {
    if (windowWidth < 768) {
      return 4; // Nếu màn hình nhỏ (mobile), chỉ slice 4 sản phẩm
    } else if (windowWidth >= 768 && windowWidth < 1024) {
      return 6; // Nếu màn hình trung bình (tablet), slice 6 sản phẩm
    } else {
      return 10; // Nếu màn hình lớn (desktop), slice 10 sản phẩm
    }
  };
  const itemsPerPage = getItemsToShow();
  return (
    <div className="bg-red-400 rounded-lg p-4">
      <div className="flex items-center justify-between py-3">
        <h3 className="text-3xl uppercase text-white font-bold ">
          Sản phẩm nổi bật
        </h3>
        <div className="flex gap-3 items-center text-white">
          <span>
            <FaFireAlt size={20} />
          </span>
          <span>
            <FaFireAlt size={20} />
          </span>
          <span>
            <FaFireAlt size={20} />
          </span>
        </div>
      </div>
      {isLoading ? (
        <div className="bg-white rounded-lg h-[400px]">
          <Loading fullWeb={false} />
        </div>
      ) : (
        <Carousel
          className="w-full"
          opts={{
            // align: "start",
            loop: false,
          }}
        >
          <CarouselContent>
            {/* Loop qua các sản phẩm và chia theo page */}
            {Array.from({
              length: Math.ceil(products.length / itemsPerPage),
            }).map((_, pageIndex) => (
              <CarouselItem key={pageIndex}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {products
                    .slice(
                      pageIndex * itemsPerPage,
                      (pageIndex + 1) * itemsPerPage
                    )
                    .map((item, index) => (
                      <CardProduct product={item} key={index} />
                    ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </div>
  );
};

//  <CardProduct product={item} />;

export default OutStandingProduct;

// const products = [
//   {
//     img: "/product_1.jpg",
//     name: "Camera IP 360 Độ 4MP EZVIZ H6C Pro",
//     price: 630000,
//     star: 4,
//     num_review: 10,
//     category_slug: "maytinh",
//     product_slug: "maytinh1",
//   },
//   {
//     img: "/product_2.jpg",
//     name: "Laptop Apple MacBook Air",
//     price: 63000000,
//     star: 4,
//     num_review: 10,
//     category_slug: "maytinh",
//     product_slug: "maytinh1",
//   },
//   {
//     img: "/product_3.jpg",
//     name: "Đồng hồ thông minh BeFit Hunter2",
//     price: 2300000,
//     star: 4,
//     num_review: 10,
//     category_slug: "maytinh",
//     product_slug: "maytinh1",
//   },
//   {
//     img: "/product_1.jpg",
//     name: "Laptop Asus Vivobook 15",
//     price: 1220000,
//     star: 4,
//     num_review: 10,
//     category_slug: "maytinh",
//     product_slug: "maytinh1",
//   },
//   {
//     img: "/product_4.jpg",
//     name: "Điện thoại OPPO Reno10 Pro",
//     price: 1220000,
//     star: 4,
//     num_review: 10,
//     category_slug: "maytinh",
//     product_slug: "maytinh1",
//   },
//   {
//     img: "/product_5.jpg",
//     name: "Điện thoại Xiaomi Redmi Note 13 Pro Điện thoại Xiaomi Redmi Note 13 Pro",
//     price: 1220000,
//     star: 4,
//     num_review: 10,
//     category_slug: "maytinh",
//     product_slug: "maytinh1",
//   },
//   {
//     img: "/product_6.jpg",
//     name: "Laptop Asus Vivobook 15",
//     price: 1220000,
//     star: 4,
//     num_review: 10,
//     category_slug: "maytinh",
//     product_slug: "maytinh1",
//   },
//   {
//     img: "/product_1.jpg",
//     name: "Laptop Asus Vivobook 15",
//     price: 1220000,
//     star: 4,
//     num_review: 10,
//     category_slug: "maytinh",
//     product_slug: "maytinh1",
//   },
//   {
//     img: "/product_4.jpg",
//     name: "Điện thoại OPPO Reno10 Pro",
//     price: 1220000,
//     star: 4,
//     num_review: 10,
//     category_slug: "maytinh",
//     product_slug: "maytinh1",
//   },
//   {
//     img: "/product_5.jpg",
//     name: "Điện thoại Xiaomi Redmi Note 13 Pro Điện thoại Xiaomi Redmi Note 13 Pro",
//     price: 1220000,
//     star: 4,
//     num_review: 10,
//     category_slug: "maytinh",
//     product_slug: "maytinh1",
//   },
//   {
//     img: "/product_6.jpg",
//     name: "Laptop Asus Vivobook 15",
//     price: 1220000,
//     star: 4,
//     num_review: 10,
//     category_slug: "maytinh",
//     product_slug: "maytinh1",
//   },
//   {
//     img: "/product_5.jpg",
//     name: "Điện thoại Xiaomi Redmi Note 13 Pro Điện thoại Xiaomi Redmi Note 13 Pro",
//     price: 1220000,
//     star: 4,
//     num_review: 10,
//     category_slug: "maytinh",
//     product_slug: "maytinh1",
//   },
//   {
//     img: "/product_6.jpg",
//     name: "Laptop Asus Vivobook 15",
//     price: 1220000,
//     star: 4,
//     num_review: 10,
//     category_slug: "maytinh",
//     product_slug: "maytinh1",
//   },
//   {
//     img: "/product_1.jpg",
//     name: "Camera IP 360 Độ 4MP EZVIZ H6C Pro",
//     price: 630000,
//     star: 4,
//     num_review: 10,
//     category_slug: "maytinh",
//     product_slug: "maytinh1",
//   },
//   {
//     img: "/product_2.jpg",
//     name: "Laptop Apple MacBook Air",
//     price: 63000000,
//     star: 4,
//     num_review: 10,
//     category_slug: "maytinh",
//     product_slug: "maytinh1",
//   },
//   {
//     img: "/product_3.jpg",
//     name: "Đồng hồ thông minh BeFit Hunter2",
//     price: 2300000,
//     star: 4,
//     num_review: 10,
//     category_slug: "maytinh",
//     product_slug: "maytinh1",
//   },
//   {
//     img: "/product_1.jpg",
//     name: "Camera IP 360 Độ 4MP EZVIZ H6C Pro",
//     price: 630000,
//     star: 4,
//     num_review: 10,
//     category_slug: "maytinh",
//     product_slug: "maytinh1",
//   },
//   {
//     img: "/product_2.jpg",
//     name: "Laptop Apple MacBook Air",
//     price: 63000000,
//     star: 4,
//     num_review: 10,
//     category_slug: "maytinh",
//     product_slug: "maytinh1",
//   },
//   {
//     img: "/product_3.jpg",
//     name: "Đồng hồ thông minh BeFit Hunter2",
//     price: 2300000,
//     star: 4,
//     num_review: 10,
//     category_slug: "maytinh",
//     product_slug: "maytinh1",
//   },
//   {
//     img: "/product_1.jpg",
//     name: "Laptop Asus Vivobook 15",
//     price: 1220000,
//     star: 4,
//     num_review: 10,
//     category_slug: "maytinh",
//     product_slug: "maytinh1",
//   },
//   {
//     img: "/product_4.jpg",
//     name: "Điện thoại OPPO Reno10 Pro",
//     price: 1220000,
//     star: 4,
//     num_review: 10,
//     category_slug: "maytinh",
//     product_slug: "maytinh1",
//   },
// ];
