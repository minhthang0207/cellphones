"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CarouselApi } from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaShoppingCart, FaStar } from "react-icons/fa";

interface SingleProductFormProps {
  product: SingleProduct;
}

const SingleProductForm: React.FC<SingleProductFormProps> = ({ product }) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [selectedIndexImage, setSelectedIndexImage] = useState<number>(0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentVariant, setCurrentVariant] = useState(product.defaultVariant);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.defaultVariant.color_slug
  );
  // const [selectedRam, setSelectedRam] = useState(product.ram[0]);
  const [selectedRom, setSelectedRom] = useState<string>(
    product.defaultVariant.rom_slug
  );

  const handleThumbnailClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
    setSelectedIndexImage(index);
  };

  const handleColorChange = (colorSlug: string) => {
    setSelectedColor(colorSlug);
  };

  const handleRomChange = (romSlug: string) => {
    setSelectedRom(romSlug);
  };

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setSelectedIndexImage(api.selectedScrollSnap());
    };

    handleSelect(); // Cập nhật ngay khi khởi tạo
    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  return (
    <div className="bg-neutral-100">
      <div className="max-w-[1280px] flex gap-4 flex-col mx-auto">
        <Breadcrumb className="pt-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link
                className="hover:text-neutral-800 transition duration-150"
                href="/"
              >
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link
                className="hover:text-neutral-800 transition duration-150"
                href={`/${product.category_slug}`}
              >
                {product.category}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex gap-4">
          {/* col1 */}
          <div className="w-[60%] flex flex-col gap-4">
            {/* row 1 */}
            <div className="relative bg-white rounded-lg p-4 w-full h-[380px] flex flex-col gap-4">
              <Carousel className="w-full h-full " setApi={setApi}>
                <CarouselContent className="-ml-1 h-full">
                  {product?.gallery_image.map((item, index) => (
                    <CarouselItem key={index} className="pl-1 h-full">
                      <div className="relative w-full h-full flex items-center">
                        <Image
                          src={item}
                          alt={`Slide ${index + 1}`}
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

              {/* Danh sách hình ảnh dưới carousel */}
              <div className="flex space-x-2 justify-center">
                {product?.gallery_image.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`relative w-12 h-12 border rounded-md overflow-hidden ${
                      selectedIndexImage === index && "border border-red-500"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p>Thông số kỹ thuật</p>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Cấu hình & Bộ nhớ</AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is it styled?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It comes with default styles that matches the other
                    components&apos; aesthetic.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is it animated?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It s animated by default, but you can disable it if you
                    prefer.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* col2 */}
          <div className="w-[40%] flex flex-col gap-4 ">
            <div className="flex flex-col gap-4 bg-white rounded-lg p-4">
              {/* Name */}
              <h4 className="font-bold text-xl text-neutral-700">
                {currentVariant.name}
              </h4>

              {/* review */}
              {/* num review */}
              <div className="flex gap-4 items-center text-neutral-600 text-sm">
                <p className="font-bold">Đánh giá:</p>
                <p className="flex gap-2 items-center">
                  <FaStar size={18} className="text-yellow-500" />
                  {product.star}
                </p>
                <p>({product.num_review})</p>
              </div>

              {/* stock */}
              <p className="text-sm text-neutral-500 font-normal">
                Còn: {currentVariant.stock_quantity} Sản phẩm
              </p>
              {/* price */}
              <div className="mb-2 flex items-center gap-4">
                <p className="text-neutral-600 text-xl font-semibold uppercase">
                  Giá hiện tại
                </p>
                <p className="text-red-600 text-xl font-semibold">
                  {currentVariant.price}VND
                </p>
              </div>
              {/* List rom */}
              <div>
                <p className="text-neutral-600 text-lg font-semibold mb-2 uppercase">
                  Dung lượng
                </p>
                <div className="flex gap-2 ">
                  {product?.rom.map((item) => {
                    return (
                      <button
                        type="button"
                        key={item.id}
                        className={`px-2 py-1  border border-neutral-400 rounded-lg ${
                          item.slug === selectedRom &&
                          "bg-red-200 border-red-500"
                        }`}
                        onClick={() => handleRomChange(item.slug)}
                      >
                        <p className="flex gap-2 items-center text-base text-neutral-600">
                          {item.name}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* List color */}
              <div>
                <p className="text-neutral-600 text-lg font-semibold mb-2 uppercase">
                  Màu sắc
                </p>
                <div className="flex gap-2 ">
                  {product?.colors?.map((item) => {
                    return (
                      <button
                        type="button"
                        key={item.id}
                        className={`px-2 py-1  border border-neutral-400 rounded-lg ${
                          item.slug === selectedColor &&
                          "bg-red-200 border-red-500"
                        }`}
                        onClick={() => handleColorChange(item.slug)}
                      >
                        <p className="flex gap-2 items-center text-base text-neutral-600">
                          <span
                            className="w-3 h-3 rounded-full border border-neutral-600"
                            style={{ backgroundColor: item.code }}
                          ></span>
                          {item.name}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* button */}
              <div className="flex gap-4">
                <button
                  type="button"
                  className="flex flex-col items-center p-1 w-1/2 border border-red-500 bg-white text-red-500 text-base rounded-lg"
                >
                  <FaShoppingCart size={18} />
                  Thêm vào giỏ hàng
                </button>
                <button
                  type="button"
                  className="flex justify-center items-center p-1 w-1/2 bg-red-500 text-white text-base rounded-lg hover:bg-red-400 transition duration-300"
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductForm;
