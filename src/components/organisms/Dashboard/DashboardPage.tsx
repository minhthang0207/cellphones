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
import { useEffect, useRef, useState } from "react";
import SaleProduct from "./SaleProduct";
import ProductGrid from "./ProductGrid";
import Link from "next/link";
import { getOutStandingProduct, getProductByCategorySlug } from "@/lib";
import Loading from "../Loading";
import UserChat from "../Chatbox/Chat";
import { useUserStore } from "@/store/user";

const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [phoneProducts, setPhoneProducts] = useState<Product[]>([]);
  const [laptopProducts, setLaptopProducts] = useState<Product[]>([]);
  const [tabletProducts, setTabletProducts] = useState<Product[]>([]);
  const [outstandingProduct, setOutStandingProduct] = useState<Product[]>([]);
  const user = useUserStore((state) => state.user);

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

  useEffect(() => {
    const fectchData = async () => {
      setIsLoading(true);
      // const result = await getAllProduct();
      // set(result.data.products);
      const result1 = await getOutStandingProduct();
      setOutStandingProduct(result1.data.products);

      const result2 = await getProductByCategorySlug("may-tinh-bang", 20);
      setTabletProducts(result2.data.products);
      const result3 = await getProductByCategorySlug("laptop", 20);
      setLaptopProducts(result3.data.products);
      const result4 = await getProductByCategorySlug("dien-thoai", 20);
      setPhoneProducts(result4.data.products);
      setIsLoading(false);
    };
    fectchData();
  }, []);

  return (
    <div className="max-w-[1280px] mx-auto h-fit">
      <div className=" grid grid-cols-[300px_1fr] my-3 w-full overflow-hidden">
        {/* sidebar left */}
        <Sidebar />
        {/* carousel */}
        <div className=" border shadow-md rounded-lg overflow-hidden">
          <Carousel className="w-full h-full ">
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
        <SaleProduct products={outstandingProduct} isLoading={isLoading} />
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
        {isLoading ? (
          <div className=" h-[400px]">
            <Loading fullWeb={false} />
          </div>
        ) : (
          <ProductGrid products={phoneProducts} />
        )}
      </div>

      {/* Grid product laptop */}
      <div className="mt-3 border rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-3xl">Laptop</span>
          <div className="flex items-center gap-3">
            {laptopBrands.map((item, index) => {
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
        {isLoading ? (
          <div className=" h-[400px]">
            <Loading fullWeb={false} />
          </div>
        ) : (
          <ProductGrid products={laptopProducts} />
        )}
      </div>

      {/* Grid product tablet */}
      <div className="mt-3 border rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-3xl">Máy tính bảng</span>
          <div className="flex items-center gap-3">
            {tabletBrands.map((item, index) => {
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
        {isLoading ? (
          <div className=" h-[400px]">
            <Loading fullWeb={false} />
          </div>
        ) : (
          <ProductGrid products={tabletProducts} />
        )}
      </div>
      {user.id && <UserChat />}
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
  { title: "iphone", link: "/dien-thoai?brand=apple" },
  { title: "samsung", link: "/dien-thoai?brand=samsung" },
  { title: "xiaomi", link: "/dien-thoai?brand=xiaomi" },
  { title: "lenovo", link: "/dien-thoai?brand=lenovo" },
];

const laptopBrands = [
  { title: "Macbook", link: "/laptop?brand=apple" },
  { title: "dell", link: "/laptop?brand=dell" },
  { title: "hp", link: "/laptop?brand=hp" },
  { title: "lenovo", link: "/laptop?brand=lenovo" },
  { title: "acer", link: "/laptop?brand=acer" },
  { title: "asus", link: "/laptop?brand=asus" },
];

const tabletBrands = [
  { title: "Ipad", link: "/may-tinh-bang?brand=apple" },
  { title: "samsung", link: "/may-tinh-bang?brand=samsung" },
  { title: "xiaomi", link: "/may-tinh-bang?brand=xiaomi" },
  { title: "huawei", link: "/may-tinh-bang?brand=huawei" },
];
