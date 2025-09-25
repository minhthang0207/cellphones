import { CiFilter } from "react-icons/ci";
import { FaTimes } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";

interface SelectedFilters {
  brand?: string[];
  price?: string[];
  screenSize?: string[];
  ram?: string[];
  rom?: string[];
}

interface FilterModalProps {
  options: FilterConfig;
  selectedFilters: SelectedFilters;
  onFilterChange: (category: keyof SelectedFilters, value: string) => void;
  onDeleteAllFilter: () => void;
  // setProducts: Dispatch<SetStateAction<Product[]>>;
  onSumbitResult: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  options,
  selectedFilters,
  onFilterChange,
  onDeleteAllFilter,
  onSumbitResult,
}) => {
  const pathname = usePathname();
  const [isModalShow, setIsModalShow] = useState(false);

  const currentFilters = options[pathname] || {};

  const handleResult = async () => {
    setIsModalShow(false);
    await onSumbitResult();
  };

  const handleDeleteFilter = async () => {
    setIsModalShow(false);
    await onDeleteAllFilter();
  };

  const handleDeleteSingleFilter = (key: string, value: string) => {
    onFilterChange(key as keyof SelectedFilters, value);
  };

  return (
    <div className="relative">
      {/* overlay */}
      {isModalShow && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-neutral-300 opacity-60 z-50"
          onClick={() => setIsModalShow(false)}
        ></div>
      )}
      {/* button */}
      <button
        type="button"
        onClick={() => setIsModalShow(!isModalShow)}
        className={`border relative flex items-center gap-2 p-1 text-base rounded-lg border-red-500 text-red-500 z-40
          ${
            isModalShow &&
            "bg-white relative before:content-[''] z-30 before:bg-white before:absolute before:left-1/2 before:-translate-x-1/2 before:top-[120%] before:w-[30px] before:h-[30px] before:transform before:rotate-45"
          }`}
      >
        <CiFilter size={20} />
        Lọc
        {Object.values(selectedFilters).some((arr) => arr.length > 0) && (
          <div className="absolute top-[2px] right-1/2 w-[12px] h-[12px] rounded-full bg-red-500 flex items-center justify-center">
            <FaCheck size={10} className="text-white" />
          </div>
        )}
      </button>
      {/* modal */}
      {isModalShow && (
        <div className="absolute  top-full h-fit w-fit mt-3 left-0 rounded-lg shadow-lg bg-white z-50 overflow-y-scroll max-h-[400px] pl-4 pt-4 pr-4">
          {/* header */}
          {/* Button close */}
          <button
            type="button"
            className="absolute right-4 top-4"
            onClick={() => setIsModalShow(false)}
          >
            <FaTimes
              size={20}
              className="text-neutral-400 hover:text-neutral-500 transition duration-300"
            />
          </button>

          {/* Item have choosen */}
          {Object.values(selectedFilters).some((arr) => arr.length > 0) && (
            <div className="mb-4">
              <h4 className="text-base font-semibold">Đã chọn:</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(selectedFilters).map(([key, values]) => {
                  const filterOptions = currentFilters[key]?.options;
                  return values.map((value: string, index: string) => {
                    const text =
                      filterOptions?.find((item) => item.value === value)
                        ?.text || value;
                    return (
                      <button
                        key={`${key}-${index}`}
                        type="button"
                        className="border flex items-center gap-2 py-1 px-2 text-base rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition duration-300"
                        onClick={() => handleDeleteSingleFilter(key, value)}
                      >
                        {text}
                        <FaTimes size={14} className="text-red-600" />
                      </button>
                    );
                  });
                })}

                <button
                  className="text-sm text-red-500 underline"
                  onClick={() => handleDeleteFilter()}
                >
                  Xóa tất cả
                </button>
              </div>
            </div>
          )}

          {/* content */}

          {Object.entries(currentFilters).map(
            ([key, { title, options }], index) => {
              return (
                <div
                  key={key}
                  className={` index-${index} ${
                    index === Object.entries(currentFilters).length - 1
                      ? "border-none"
                      : "border-b"
                  }`}
                >
                  <h4 className="text-base font-semibold mt-2 ">{title}</h4>
                  <div className="flex gap-2 py-4 ">
                    {options.map((item, index) => {
                      const isSelected = selectedFilters[
                        key as keyof SelectedFilters
                      ]?.includes(item.value);
                      return (
                        <button
                          key={index}
                          className={`border relative flex items-center gap-2 py-1 px-2 text-base rounded-lg transition duration-300 hover:border-red-500 ${
                            isSelected && "border-red-500"
                          }`}
                          onClick={() =>
                            onFilterChange(
                              key as keyof SelectedFilters,
                              item.value
                            )
                          }
                        >
                          {item.text}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }
          )}
          {/* footer */}
          {Object.values(selectedFilters).some((arr) => arr.length > 0) && (
            <div className="sticky bottom-0 left-0 right-0 h-[50px] py-2 bg-white flex  gap-4 items-center border-t-2 shadow-lg">
              <button
                type="button"
                className="text-red-600 bg-white border rounded-lg border-red-500 min-w-[100px] w-full h-full"
                onClick={() => setIsModalShow(false)}
              >
                Bỏ chọn
              </button>
              <button
                type="button"
                className="text-white bg-red-500 border rounded-lg border-red-500 min-w-[100px] w-full h-full"
                onClick={handleResult}
              >
                Xem kết quả
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterModal;
