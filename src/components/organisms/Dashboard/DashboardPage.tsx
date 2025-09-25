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
import {useRef } from "react";
import SaleProduct from "./SaleProduct";
import UserChat from "../Chatbox/Chat";
import { useUserStore } from "@/store/user";
import ProductGroup from "./ProductGroup";

import { useLandingProducts } from "@/hooks/useLandingProduct";


const DashboardPage: React.FC = () => {
  const { outstanding, tablets, laptops, phones, isLoading, isError } = useLandingProducts();
  
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

  if (isError) {
    return <p>Không thể tải sản phẩm. Vui lòng thử lại sau.</p>;
  }

  return (
    <div className="max-w-[1280px] mx-auto h-fit">
      <div className="md:grid md:grid-cols-[300px_1fr] my-3 w-full overflow-hidden sm">
        {/* sidebar left */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        {/* carousel */}
        <div className=" h-[200px] sm:h-[300px] md:h-full border shadow-md rounded-lg overflow-hidden">
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
      <div className="flex flex-col gap-4 px-4 sm:flex-row items-center border rounded-lg py-3 my-3">
        <div className="flex gap-4 w-full sm:w-1/3 items-center sm:justify-center">
          <IoReturnUpBack size={30} className="text-red-700" />
          <div className="flex flex-col gap-1">
            <span className="text-sm md:text-xl">Trả hàng Miễn phí 15 ngày</span>
            <span className="text-sm text-neutral-500">
              Trả hàng miễn phí trong 15 ngày
            </span>
          </div>
        </div>
        <div className="flex gap-4 w-full sm:w-1/3 items-center sm:justify-center">
          <LuShieldCheck size={30} className="text-red-700" />
          <div className="flex flex-col gap-1">
            <span className="text-sm md:text-xl">Hàng chính hãng 100%</span>
            <span className="text-sm text-neutral-500">
              Đảm bảo hàng chính hãng hoặc hoàn tiền gấp đôi
            </span>
          </div>
        </div>
        <div className="flex gap-4 w-full sm:w-1/3 items-center sm:justify-center">
          <MdOutlineLocalShipping size={30} className="text-red-700" />
          <div className="flex flex-col gap-1">
            <span className="text-sm md:text-xl">Miễn phí vận chuyển</span>
            <span className="text-sm text-neutral-500">
              Giao hàng miễn phí toàn quốc
            </span>
          </div>
        </div>
      </div>

      {/* Sale Product */}
      <div>
        <SaleProduct products={outstanding} isLoading={isLoading} />
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
      <ProductGroup 
        label="Điện thoại" 
        linkAll="/dien-thoai" 
        isLoading={isLoading}  
        listBrand={phoneBrands}
        product={phones}
      />

      {/* Grid product laptop */}
      <ProductGroup 
        label="Laptop" 
        linkAll="/laptop" 
        isLoading={isLoading}
        listBrand={laptopBrands}
        product={laptops}
      />

      {/* Grid product tablet */}
      <ProductGroup 
        label="Máy tính bảng" 
        linkAll="/may-tinh-bang" 
        isLoading={isLoading}
        listBrand={tabletBrands}
        product={tablets}
      />
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
