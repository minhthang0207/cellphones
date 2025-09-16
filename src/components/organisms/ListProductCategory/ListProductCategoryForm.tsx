"use client";
import FilterModal from "@/components/organisms/ListProductCategory/FilterModal";
import { useEffect, useState } from "react";
import ProductGrid from "../Dashboard/ProductGrid";
import { getFilteredProduct } from "@/lib";
import Loading from "../Loading";
import { useSearchParams } from "next/navigation";

import PaginationComponent from "./PaginationComponent";

interface SelectedFilters {
  brand: string[];
  price: string[];
  screenSize: string[];
  ram: string[];
  rom: string[];
}

interface ListProductCategoryFormProps {
  slug: string;
}

const ListProductCategoryForm: React.FC<ListProductCategoryFormProps> = ({
  slug,
}) => {
  const searchParams = useSearchParams(); // Lấy query params từ URL
  const brandParams = searchParams.get("brand");
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
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [limit, setLimit] = useState(20);

  const handleFilterClick = async (
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
    const isAllFiltersEmpty = Object.values(newFilters).every(
      (filter) => filter.length === 0
    );

    if (isAllFiltersEmpty) {
      setIsLoading(true);
      setCurrentPage(1);
      const result = await getFilteredProduct(
        sortOrder,
        slug,
        newFilters,
        limit,
        1
      );
      setProducts(result.data.products);
      setTotalPages(result.data.totalPages);
      setIsLoading(false);
    }
  };

  const handleDeleteAllFilter = async () => {
    const newSelectedFilter = {
      brand: [],
      price: [],
      screenSize: [],
      ram: [],
      rom: [],
    };
    setSelectedFilters(newSelectedFilter);
    setIsLoading(true);
    setCurrentPage(1);
    const result = await getFilteredProduct(
      sortOrder,
      slug,
      newSelectedFilter,
      limit,
      1
    );
    setProducts(result.data.products);
    setTotalPages(result.data.totalPages);
    setIsLoading(false);
  };

  const handleSumbitResult = async () => {
    setIsLoading(true);
    setCurrentPage(1);
    const result = await getFilteredProduct(
      sortOrder,
      slug,
      selectedFilters,
      limit,
      1
    );
    setProducts(result.data.products);
    setTotalPages(result.data.totalPages);
    setIsLoading(false);
  };

  const handlePageChange = async (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setIsLoading(true);
      setCurrentPage(page);
      const result = await getFilteredProduct(
        sortOrder,
        slug,
        selectedFilters,
        limit,
        page
      );
      setProducts(result.data.products);
      setTotalPages(result.data.totalPages);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSumbitResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOrder]);

  useEffect(() => {
    const newFilters = { ...selectedFilters };
    if (brandParams && !newFilters.brand.includes(brandParams)) {
      newFilters.brand.push(brandParams);
    }

    const fetchData = async () => {
      setIsLoading(true);

      try {
        setCurrentPage(1);
        const result = await getFilteredProduct(
          sortOrder,
          slug,
          newFilters,
          limit,
          1
        );
        setProducts(result.data.products);
        setTotalPages(result.data.totalPages);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, brandParams, limit, sortOrder, selectedFilters]);

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
        {/* pagination */}
        {/* Phân trang */}
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ListProductCategoryForm;

const filterConfig: FilterConfig = {
  "/laptop": {
    brand: {
      title: "Thương hiệu",
      options: [
        { text: "Acer", value: "acer" },
        { text: "Macbook", value: "apple" },
        { text: "Asus", value: "asus" },
        { text: "Dell", value: "dell" },
        { text: "Lenovo", value: "lenovo" },
        { text: "HP", value: "hp" },
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
  "/dien-thoai": {
    brand: {
      title: "Thương hiệu",
      options: [
        { text: "Iphone", value: "apple" },
        { text: "Samsung", value: "samsung" },
        { text: "Xiaomi", value: "xiaomi" },
        { text: "Huawei", value: "huawei" },
      ],
    },
    price: {
      title: "Giá",
      options: [
        { text: "Dưới 5 triệu", value: "<5000000" },
        { text: "5 - 10 triệu", value: "5000000-10000000" },
        { text: "Trên 10 triệu", value: ">10000000" },
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
  "/may-tinh-bang": {
    brand: {
      title: "Thương hiệu",
      options: [
        { text: "Ipad", value: "apple" },
        { text: "Samsung", value: "samsung" },
        { text: "Xiaomi", value: "xiaomi" },
        { text: "Huawei", value: "huawei" },
      ],
    },
    price: {
      title: "Giá",
      options: [
        { text: "Dưới 5 triệu", value: "<5000000" },
        { text: "5 - 10 triệu", value: "5000000-10000000" },
        { text: "10 - 20 triệu", value: "10000000-20000000" },
        { text: "Trên 20 triệu", value: ">20000000" },
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
