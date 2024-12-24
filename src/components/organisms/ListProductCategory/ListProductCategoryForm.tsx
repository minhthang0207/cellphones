"use client";
import FilterModal from "@/components/organisms/ListProductCategory/FilterModal";
import { useCallback, useEffect, useState } from "react";
import ProductGrid from "../Dashboard/ProductGrid";
import { getFilteredProduct, getProductByCategorySlug } from "@/lib";
import Loading from "../Loading";

interface SelectedFilters {
  brand?: string[];
  price?: string[];
  screenSize?: string[];
  ram?: string[];
  rom?: string[];
}

interface ListProductCategoryFormProps {
  slug: string;
}

const ListProductCategoryForm: React.FC<ListProductCategoryFormProps> = ({
  slug,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    brand: [],
    price: [],
    screenSize: [],
    ram: [],
    rom: [],
  });

  const [sortOrder, setSortOrder] = useState<string>("");
  console.log(sortOrder);

  const handleFilterClick = (
    category: keyof SelectedFilters,
    value: string
  ) => {
    const newFilters = { ...selectedFilters };

    if (!newFilters[category]) {
      newFilters[category] = [];
    }

    if (newFilters[category]?.includes(value)) {
      newFilters[category] = newFilters[category]?.filter(
        (item) => item !== value
      );
    } else {
      newFilters[category]?.push(value);
    }
    setSelectedFilters(newFilters);
  };

  const handleDeleteAllFilter = async () => {
    setSelectedFilters({
      brand: [],
      price: [],
      screenSize: [],
      ram: [],
      rom: [],
    });
    setIsLoading(true);
    const result = await getProductByCategorySlug(slug);
    setProducts(result.data.products);
    setIsLoading(false);
  };

  const handleSumbitResult = async () => {
    setIsLoading(true);
    const result = await getFilteredProduct(sortOrder, slug, selectedFilters);
    setProducts(result.data.products);
    setIsLoading(false);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const result = await getFilteredProduct(sortOrder, slug);
    setProducts(result.data.products);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    handleSumbitResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOrder]);

  useEffect(() => {
    // Kiểm tra nếu tất cả các mảng trong selectedFilters đều rỗng
    const isAllFiltersEmpty = Object.values(selectedFilters).every(
      (filter) => filter.length === 0
    );

    if (isAllFiltersEmpty) {
      fetchData(); // Gọi API khi tất cả bộ lọc đều rỗng
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters, slug]);

  // useEffect để gọi fetchData ban đầu
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <div className="bg-neutral-100">
      <div className="bg-white max-w-[1280px] mx-auto p-4 rounded-lg">
        <div className="">
          {/* btn filter */}
          <FilterModal
            options={filterConfig}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterClick}
            onDeleteAllFilter={handleDeleteAllFilter}
            onSumbitResult={handleSumbitResult}
          />
        </div>
        {/* list filter */}
        <div className="flex gap-4 items-baseline mt-4">
          <p className="text-base">Sắp xếp theo:</p>
          <div className="flex gap-4">
            {listSortOrder.map((item, index) => {
              return (
                <button
                  type="button"
                  key={index}
                  className={`${
                    sortOrder === item.value
                      ? "text-red-600"
                      : "text-neutral-600"
                  }`}
                  onClick={() => setSortOrder(item.value)}
                >
                  {item.text}
                </button>
              );
            })}
          </div>
        </div>

        {/* List product */}
        <div className="mt-4">
          {isLoading ? (
            <div className=" h-[400px]">
              <Loading fullWeb={false} />
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ListProductCategoryForm;

const filterConfig: FilterConfig = {
  "/maytinh12": {
    brand: {
      title: "Thương hiệu",
      options: [
        { text: "Acer", value: "acer" },
        { text: "Iphone", value: "iphone123" },
        { text: "asus", value: "asus" },
        { text: "Lenovo", value: "lenovo" },
      ],
    },
    price: {
      title: "Giá",
      options: [
        { text: "Dưới 10 triệu", value: "<10000000" },
        { text: "10 - 15 triệu", value: "10000000-15000000" },
        { text: "15 - 20 triệu", value: "15000000-20000000" },
        { text: "20 - 25 triệu", value: "20000000-25000000" },
        { text: "Trên 30 triệu", value: ">30000000" },
      ],
    },
    // screenSize: {
    //   title: "Kích thước màn hình",
    //   options: [
    //     { text: "13 inch", value: "13-inch" },
    //     { text: "15 inch", value: "15-inch" },
    //     { text: "17 inch", value: "17-inch" },
    //   ],
    // },
    ram: {
      title: "RAM",
      options: [
        { text: "4GB", value: "4" },
        { text: "6GB", value: "6" },
        { text: "8GB", value: "8" },
        { text: "12GB", value: "12" },
      ],
    },
    rom: {
      title: "Dung lượng lưu trữ",
      options: [
        { text: "64GB", value: "64" },
        { text: "128GB", value: "128" },
        { text: "256GB", value: "256" },
        { text: "512GB", value: "512" },
      ],
    },
  },
  "/dtdd": {
    brand: {
      title: "Thương hiệu",
      options: [
        { text: "Apple", value: "apple" },
        { text: "Samsung", value: "samsung" },
        { text: "Xiaomi", value: "xiaomi" },
      ],
    },
    price: {
      title: "Giá",
      options: [
        { text: "Dưới 5 triệu", value: "duoi-5-trieu" },
        { text: "5 - 10 triệu", value: "5-10-trieu" },
        { text: "Trên 10 triệu", value: "tren-10-trieu" },
      ],
    },
    ram: {
      title: "RAM",
      options: [
        { text: "4GB", value: "4gb" },
        { text: "6GB", value: "6gb" },
        { text: "8GB", value: "8gb" },
        { text: "12GB", value: "12gb" },
      ],
    },
    rom: {
      title: "Dung lượng lưu trữ",
      options: [
        { text: "64GB", value: "64gb" },
        { text: "128GB", value: "128gb" },
        { text: "256GB", value: "256gb" },
        { text: "512GB", value: "512gb" },
      ],
    },
  },
};

const listSortOrder = [
  {
    text: "Nổi bật",
    value: "noi-bat",
  },
  {
    text: "Giá tăng dần",
    value: "gia-tang-dan",
  },
  {
    text: "Giá giảm dần",
    value: "gia-giam-dan",
  },
];

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
