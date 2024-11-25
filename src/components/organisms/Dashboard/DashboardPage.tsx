"use client";
import Sidebar from "../Sidebar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import Image from "next/image";
import {
  SiLogitech,
  SiHuawei,
  SiDell,
  SiSony,
  SiXiaomi,
  SiJbl,
  SiHp,
} from "react-icons/si";
import { IoReturnUpBack } from "react-icons/io5";
import { LuShieldCheck } from "react-icons/lu";
import { MdOutlineLocalShipping } from "react-icons/md";
import { IoLogoApple } from "react-icons/io";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import SaleProduct from "./SaleProduct";
import ProductGrid from "./ProductGrid";
import Link from "next/link";

const DashboardPage: React.FC = () => {
  const plugin = useRef(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Autoplay({ delay: 2000, stopOnMouseEnter: true }) as any
  );

  const handleMouseEnter = () => {
    plugin.current?.stop();
  };

  // Tiếp tục autoplay khi chuột rời khỏi
  const handleMouseLeave = () => {
    plugin.current?.play(); // Sử dụng reset() thay vì start()
  };

  return (
    <div className="max-w-[1280px] mx-auto h-fit">
      <div className=" grid grid-cols-[300px_1fr] my-3 w-full overflow-hidden">
        {/* sidebar left */}
        <Sidebar />
        {/* carousel */}
        <div className=" border shadow-md rounded-lg overflow-hidden">
          <Carousel className="w-full h-full ml-3 ">
            <CarouselContent className="-ml-1 h-full">
              {banner.map((item, index) => (
                <CarouselItem key={index} className="pl-1 h-full">
                  <div className="relative w-full h-full flex items-center">
                    <Image
                      src={item.src}
                      alt="Banner image"
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>

      {/* policy */}
      <div className="flex items-center border rounded-lg py-3 my-3">
        <div className="flex gap-4 w-1/3 items-center justify-center">
          <IoReturnUpBack size={30} className="text-red-700" />
          <div className="flex flex-col gap-1">
            <span className="text-xl">Trả hàng Miễn phí 15 ngày</span>
            <span className="text-sm text-neutral-500">
              Trả hàng miễn phí trong 15 ngày
            </span>
          </div>
        </div>
        <div className="flex gap-4 w-1/3 items-center justify-center">
          <LuShieldCheck size={30} className="text-red-700" />
          <div className="flex flex-col gap-1">
            <span className="text-xl">Hàng chính hãng 100%</span>
            <span className="text-sm text-neutral-500">
              Đảm bảo hàng chính hãng hoặc hoàn tiền gấp đôi
            </span>
          </div>
        </div>
        <div className="flex gap-4 w-1/3 items-center justify-center">
          <MdOutlineLocalShipping size={30} className="text-red-700" />
          <div className="flex flex-col gap-1">
            <span className="text-xl">Miễn phí vận chuyển</span>
            <span className="text-sm text-neutral-500">
              Giao hàng miễn phí toàn quốc
            </span>
          </div>
        </div>
      </div>

      {/* Sale Product */}
      <div>
        <SaleProduct />
      </div>

      {/* logo business */}
      <div className="my-4">
        <Carousel
          className="w-full"
          opts={{
            align: "start",
            loop: true,
            // Tốc độ cuộn
          }}
          plugins={[plugin.current]}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
        >
          <CarouselContent className="-ml-1">
            {logos.map((item, index) => (
              <CarouselItem
                key={index}
                className="pl-1 basis-1/2 md:basis-1/3 lg:basis-1/5"
              >
                <div className="p-1 flex justify-center items-center text-neutral-400 hover:text-neutral-800 transition duration-150 cursor-pointer">
                  {item.icon}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Grid product phone */}
      <div className="mt-3 border rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-3xl">Điện thoại</span>
          <div className="flex items-center gap-3">
            {phoneBrands.map((item, index) => {
              return (
                <Link
                  href={item.link}
                  key={index}
                  className="border rounded-lg p-2 capitalize hover:text-white hover:bg-red-500 transition duration-200"
                >
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
        <ProductGrid products={products} />
      </div>
    </div>
  );
};

export default DashboardPage;

const logos = [
  {
    icon: <SiLogitech size={70} />,
  },
  {
    icon: <SiHuawei size={70} />,
  },
  {
    icon: <SiDell size={70} />,
  },
  {
    icon: <SiSony size={70} />,
  },
  {
    icon: <SiXiaomi size={70} />,
  },
  {
    icon: <IoLogoApple size={70} />,
  },
  {
    icon: <SiJbl size={70} />,
  },
  {
    icon: <SiHp size={70} />,
  },
];

const banner = [
  { src: "/banner1.png" },
  { src: "/banner2.png" },
  { src: "/banner3.png" },
  { src: "/banner4.png" },
];

const phoneBrands = [
  { title: "iphone", link: "/product/iphone" },
  { title: "samsung", link: "/product/samsung" },
  { title: "xiaomi", link: "/product/xiaomi" },
  { title: "nokia", link: "/product/nokia" },
];

const products = [
  {
    img: "/product_1.jpg",
    name: "Camera IP 360 Độ 4MP EZVIZ H6C Pro",
    price: 630000,
    link: "/product_1",
    star: 4,
    num_review: 10,
  },
  {
    img: "/product_2.jpg",
    name: "Laptop Apple MacBook Air",
    price: 63000000,
    link: "/product_1",
    star: 4,
    num_review: 10,
  },
  {
    img: "/product_3.jpg",
    name: "Đồng hồ thông minh BeFit Hunter2",
    price: 2300000,
    link: "/product_1",
    star: 4,
    num_review: 10,
  },
  {
    img: "/product_1.jpg",
    name: "Laptop Asus Vivobook 15",
    price: 1220000,
    link: "/product_1",
    star: 4,
    num_review: 10,
  },
  {
    img: "/product_4.jpg",
    name: "Điện thoại OPPO Reno10 Pro",
    price: 1220000,
    link: "/product_1",
    star: 4,
    num_review: 10,
  },
  {
    img: "/product_5.jpg",
    name: "Điện thoại Xiaomi Redmi Note 13 Pro Điện thoại Xiaomi Redmi Note 13 Pro",
    price: 1220000,
    link: "/product_1",
    star: 4,
    num_review: 10,
  },
  {
    img: "/product_6.jpg",
    name: "Laptop Asus Vivobook 15",
    price: 1220000,
    link: "/product_1",
    star: 4,
    num_review: 10,
  },
  {
    img: "/product_1.jpg",
    name: "Laptop Asus Vivobook 15",
    price: 1220000,
    link: "/product_1",
    star: 4,
    num_review: 10,
  },
  {
    img: "/product_4.jpg",
    name: "Điện thoại OPPO Reno10 Pro",
    price: 1220000,
    link: "/product_1",
    star: 4,
    num_review: 10,
  },
  {
    img: "/product_5.jpg",
    name: "Điện thoại Xiaomi Redmi Note 13 Pro Điện thoại Xiaomi Redmi Note 13 Pro",
    price: 1220000,
    link: "/product_1",
    star: 4,
    num_review: 10,
  },
  {
    img: "/product_6.jpg",
    name: "Laptop Asus Vivobook 15",
    price: 1220000,
    link: "/product_1",
    star: 4,
    num_review: 10,
  },
  {
    img: "/product_5.jpg",
    name: "Điện thoại Xiaomi Redmi Note 13 Pro Điện thoại Xiaomi Redmi Note 13 Pro",
    price: 1220000,
    link: "/product_1",
    star: 4,
    num_review: 10,
  },
  {
    img: "/product_6.jpg",
    name: "Laptop Asus Vivobook 15",
    price: 1220000,
    link: "/product_1",
    star: 4,
    num_review: 10,
  },
  {
    img: "/product_1.jpg",
    name: "Camera IP 360 Độ 4MP EZVIZ H6C Pro",
    price: 630000,
    link: "/product_1",
    star: 4,
    num_review: 10,
  },
  {
    img: "/product_2.jpg",
    name: "Laptop Apple MacBook Air",
    price: 63000000,
    link: "/product_1",
    star: 4,
    num_review: 10,
  },
  {
    img: "/product_3.jpg",
    name: "Đồng hồ thông minh BeFit Hunter2",
    price: 2300000,
    link: "/product_1",
    star: 4,
    num_review: 10,
  },
  {
    img: "/product_1.jpg",
    name: "Camera IP 360 Độ 4MP EZVIZ H6C Pro",
    price: 630000,
    link: "/product_1",
    star: 4,
    num_review: 10,
  },
  {
    img: "/product_2.jpg",
    name: "Laptop Apple MacBook Air",
    price: 63000000,
    link: "/product_1",
    star: 4,
    num_review: 10,
  },
  {
    img: "/product_3.jpg",
    name: "Đồng hồ thông minh BeFit Hunter2",
    price: 2300000,
    link: "/product_1",
    star: 4,
    num_review: 10,
  },
  {
    img: "/product_1.jpg",
    name: "Laptop Asus Vivobook 15",
    price: 1220000,
    link: "/product_1",
    star: 4,
    num_review: 10,
  },
  {
    img: "/product_4.jpg",
    name: "Điện thoại OPPO Reno10 Pro",
    price: 1220000,
    link: "/product_1",
    star: 4,
    num_review: 10,
  },
];
