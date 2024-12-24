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
  product: Product;
  variants: Variant_Product[];
  productImages: Product_Image[];
  listColor: Color[];
  listRam: Ram[];
  listRom: Rom[];
}

const SingleProductForm: React.FC<SingleProductFormProps> = ({
  product,
  variants,
  productImages,
  listColor,
  // listRam,
  // listRom,
}) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [selectedIndexImage, setSelectedIndexImage] = useState<number>(0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedColor, setSelectedColor] = useState<Color | null>(
    listColor[0] || null
  );
  const [listRam, setListRam] = useState<Ram[]>([]);
  const [selectedRam, setSelectedRam] = useState<Ram | null>(null);
  const [listRom, setListRom] = useState<Rom[]>([]);
  const [selectedRom, setSelectedRom] = useState<Rom | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  console.log("selectedRAm", selectedRam);
  console.log("selectedRom", selectedRom);

  useEffect(() => {
    if (listColor.length > 0) {
      const defaultColor = listColor[0]; // Màu đầu tiên
      setSelectedColor(defaultColor);

      // Cập nhật danh sách RAM và chọn RAM đầu tiên
      const availableRams = Array.from(
        new Set(
          variants
            .filter((variant) => variant.color_id === defaultColor.id)
            .map((variant) => variant.Ram)
        )
      );
      setListRam(availableRams);
      setSelectedRam(availableRams[0] || null);

      // Cập nhật danh sách ROM và chọn ROM đầu tiên
      const availableRoms = Array.from(
        new Set(
          variants
            .filter(
              (variant) =>
                variant.color_id === defaultColor.id &&
                variant.ram_id === (availableRams[0]?.id || null)
            )
            .map((variant) => variant.Rom)
        )
      );
      setListRom(availableRoms);
      setSelectedRom(availableRoms[0] || null);
    }
  }, [listColor, variants]); // Chạy khi `listColor` hoặc `variants` thay đổi

  useEffect(() => {
    if (selectedColor) {
      const availableRams = Array.from(
        new Map(
          variants
            .filter((variant) => variant.color_id === selectedColor.id)
            .map((variant) => [variant.Ram.id, variant.Ram]) // Sử dụng Map để loại bỏ trùng lặp theo `id`
        ).values()
      );
      setListRam(availableRams);
      setSelectedRam(availableRams[0] || null); // Chọn RAM đầu tiên
    }
  }, [selectedColor, variants]);
  useEffect(() => {
    if (selectedColor && selectedRam) {
      const availableRoms = Array.from(
        new Map(
          variants
            .filter(
              (variant) =>
                variant.color_id === selectedColor.id &&
                variant.ram_id === selectedRam.id
            )
            .map((variant) => [variant.Rom.id, variant.Rom]) // Sử dụng Map để loại bỏ trùng lặp theo `id`
        ).values()
      );
      setListRom(availableRoms);
      setSelectedRom(availableRoms[0] || null); // Chọn ROM đầu tiên
    }
  }, [selectedColor, selectedRam, variants]);

  useEffect(() => {
    updateSelectedVariant(selectedColor, selectedRam, selectedRom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor, selectedRam, selectedRom]);

  // Hàm xử lý khi người dùng chọn color, ram, rom
  const handleColorSelect = (color: Color) => {
    setSelectedColor(color);
    updateSelectedVariant(color, selectedRam, selectedRom);
  };

  const handleRamSelect = (ram: Ram) => {
    setSelectedRam(ram);
    updateSelectedVariant(selectedColor, ram, selectedRom);
  };

  const handleRomSelect = (rom: Rom) => {
    setSelectedRom(rom);
    updateSelectedVariant(selectedColor, selectedRam, rom);
  };

  // Hàm cập nhật selectedVariant dựa trên color, ram, rom
  const updateSelectedVariant = (
    color: Color | null,
    ram: Ram | null,
    rom: Rom | null
  ) => {
    const selected = variants.find(
      (variant) =>
        (!color || variant.Color.id === color.id) &&
        (!ram || variant.Ram.id === ram.id) &&
        (!rom || variant.Rom.id === rom.id)
    );
    setSelectedVariant(selected || null);
  };

  const handleThumbnailClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
    setSelectedIndexImage(index);
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
    <div className="bg-neutral-100 pt-8 pb-8 rounded-lg ">
      <div className="max-w-[1280px] flex gap-4 flex-col mx-auto bg-white rounded-lg ">
        <Breadcrumb className="p-4">
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
                href={`/${product.Product_Category?.slug}`}
              >
                {product?.Product_Category?.name}
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
          <div className="w-[60%] flex flex-col gap-4 px-4 py-8">
            {/* row 1 */}
            <div className="my-10">
              <div className="relative bg-white rounded-lg  w-full h-[500px] flex flex-col gap-4">
                <Carousel className="w-full h-full " setApi={setApi}>
                  <CarouselContent className="-ml-1 h-full">
                    {productImages.map((item, index) => (
                      <CarouselItem key={index} className="pl-1 h-full">
                        <div className="relative w-full h-full flex items-center">
                          <Image
                            src={item.url}
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
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`relative w-16 h-16 border rounded-md overflow-hidden ${
                        selectedIndexImage === index && "border border-red-500"
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </button>
                  ))}
                </div>
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
              <h4 className="font-bold text-4xl text-neutral-800">
                {selectedVariant?.name}
              </h4>

              {/* review */}
              {/* num review */}
              <div className="flex gap-4 items-center text-neutral-600 text-sm">
                <p className="font-bold">Đánh giá</p>
                <p className="flex gap-2 items-center">
                  <FaStar size={18} className="text-yellow-500" />
                  {product.average_rating}
                </p>
                <p>({product.ratings_count})</p>
              </div>

              {/* stock */}
              <p className="text-sm text-neutral-500 font-normal">
                Còn: {selectedVariant?.stock_quantity} Sản phẩm
              </p>
              {/* price */}
              <div className="mb-2 flex items-center gap-4">
                {/* <p className="text-neutral-600 text-xl font-semibold uppercase">
                  Giá hiện tại
                </p> */}
                <p className="text-red-600 text-xl font-semibold">
                  {Number(selectedVariant?.price).toLocaleString("vi-en")}
                  <sup>đ</sup>
                </p>
              </div>
              {/* detail */}
              <p>
                {product.description}
                Đây là sản phẩm mới về được sử dụng rộng rãi và có hiệu suất rất
                cao{" "}
              </p>
              {/* List color */}
              <div>
                <p className="text-neutral-600 text-lg font-semibold mb-2 uppercase">
                  Màu sắc
                </p>
                <div className="flex gap-2 ">
                  {listColor.map((item) => {
                    return (
                      <button
                        type="button"
                        key={item.id}
                        className={`px-2 py-1  border border-neutral-400 rounded-lg ${
                          item.id === selectedColor?.id &&
                          "bg-red-200 border-red-500"
                        }`}
                        onClick={() => handleColorSelect(item)}
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
              {/* List ram */}
              <div>
                <p className="text-neutral-600 text-lg font-semibold mb-2 uppercase">
                  Dung lượng RAM
                </p>
                <div className="flex gap-2 ">
                  {listRam.map((item) => {
                    return (
                      <button
                        type="button"
                        key={item.id}
                        className={`px-2 py-1  border border-neutral-400 rounded-lg ${
                          item.id === selectedRam?.id &&
                          "bg-red-200 border-red-500"
                        }`}
                        onClick={() => handleRamSelect(item)}
                      >
                        <p className="flex gap-2 items-center text-base text-neutral-600">
                          {item.capacity}GB
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* List rom */}
              <div>
                <p className="text-neutral-600 text-lg font-semibold mb-2 uppercase">
                  Dung lượng ROM
                </p>
                <div className="flex gap-2 ">
                  {listRom.map((item) => {
                    return (
                      <button
                        type="button"
                        key={item.id}
                        className={`px-2 py-1  border border-neutral-400 rounded-lg ${
                          item.id === selectedRom?.id &&
                          "bg-red-200 border-red-500"
                        }`}
                        onClick={() => handleRomSelect(item)}
                      >
                        <p className="flex gap-2 items-center text-base text-neutral-600">
                          {item.capacity}GB
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
