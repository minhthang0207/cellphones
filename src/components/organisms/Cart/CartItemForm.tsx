import useCartStore from "@/store/cart";
import type { CartItem, ItemCheckout } from "@/types/cart";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { RiSubtractFill } from "react-icons/ri";
import { toast } from "sonner";
import CustomAlertDialog from "@/components/ui/alert-dialog-custom";

interface CartItemFormProp {
  item: CartItem;
  index: number;
  onCheckboxChange: (item: CartItem) => void;
  selectedItems: ItemCheckout[];
  setSelectedItems: React.Dispatch<React.SetStateAction<ItemCheckout[]>>;
}

const CartItemForm: React.FC<CartItemFormProp> = ({
  item,
  index,
  onCheckboxChange,
  selectedItems,
  setSelectedItems,
}) => {
  const [isShowAlert, setIsShowAlert] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const [quantity, setQuantity] = useState(item.quantity);
  const [isLoading, setIsLoading] = useState(false);
  const { updateCart, deleteCart } = useCartStore();
  const [tempQuantity, setTempQuantity] = useState<number>(quantity);

  const handleDeleteItem = () => {
    setIsShowAlert(true);
  };

  const handleDelete = async () => {
    const result = await deleteCart(item.id); // Gọi API hoặc logic cập nhật giỏ hàng
    if (result.success) {
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } else {
      toast.error(result.message);
    }
    setSelectedItems([]);
    setIsLoading(false);
  };

  const handleCancel = () => {
    setIsShowAlert(false); // Đóng dialog
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setTempQuantity(value); // Chỉ cập nhật tạm thời trong quá trình nhập liệu
      setSelectedItems([]);
    }
  };

  const handleBlur = () => {
    if (tempQuantity !== quantity) {
      // Chỉ cập nhật nếu giá trị thay đổi
      setQuantity(tempQuantity); // Cập nhật quantity thực sự vào giỏ hàng
      setSelectedItems([]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && tempQuantity !== quantity) {
      setQuantity(tempQuantity); // Cập nhật quantity khi nhấn Enter
      (event.target as HTMLInputElement).blur();
      setSelectedItems([]);
    }
  };

  const handleIncreaseQuantity = () => {
    if (quantity > item.Variant.stock_quantity) {
      return;
    }
    setQuantity(quantity + 1);
    setTempQuantity(quantity + 1);
    setSelectedItems([]);
  };

  const handleDecreaseQuantity = () => {
    if (quantity <= 1) {
      return;
    }
    setQuantity(quantity - 1);
    setTempQuantity(quantity - 1);
    setSelectedItems([]);
  };

  useEffect(() => {
    if (quantity === item.quantity) {
      return;
    }
    const timer = setTimeout(async () => {
      setIsLoading(true);
      const result = await updateCart(item.id, quantity); // Gọi API hoặc logic cập nhật giỏ hàng
      if (result.success) {
        toast.success("Cập nhật giỏ hàng thành công");
      } else {
        toast.error(result.message);
        setTempQuantity(item.quantity);
        setQuantity(item.quantity);
      }
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [quantity, item.id, updateCart, item.quantity]); // Thêm dependency item.id và updateCart

  return (
    <div
      key={item.id}
      className={`flex gap-4 flex-col pb-4 ${
        index < cart.length - 1 && "border-b"
      }`}
    >
      {/* content */}
      <div className="`flex gap-4 justify-between">
        <div className=" flex items-start gap-4 ">
          <input
            type="checkbox"
            checked={selectedItems.some(
              (selectedItem) => selectedItem.variant_id === item.variant_id
            )}
            onChange={() => onCheckboxChange(item)}
          />
          <Image
            width={100}
            height={100}
            src={item?.Variant?.Product?.image}
            alt={item?.Variant?.Product?.name}
          />
          <div className=" flex flex-col gap-4">
            <h3>{item.Variant.Product.name}</h3>
            <p>Tên sản phẩm: {item.Variant.name}</p>
            <p>
              Ram: {item.Variant.Ram.capacity}GB | Rom:{" "}
              {item.Variant.Rom.capacity}GB
            </p>
            <p className="flex gap-2 items-center">
              Màu sắc:
              <span className="capitalize">{item.Variant.Color.name}</span>
              <span
                className="w-4 h-4 rounded-full block"
                style={{ backgroundColor: item.Variant.Color.code }}
              ></span>
            </p>
          </div>
          <p className="flex-1 text-right">
            <span className="text-red-500">
              {item.Variant.price.toLocaleString()}đ
            </span>
          </p>
        </div>
      </div>
      {/* button update */}
      <div className="w-full flex items-center justify-end gap-4">
        <button
          type="button"
          className={`font-bold text-base text-neutral-500 ${
            isLoading && "cursor-not-allowed"
          }
          `}
          onClick={handleDeleteItem}
          disabled={isLoading}
        >
          Xóa
        </button>
        <div className="flex">
          <button
            type="button"
            className={`${
              isLoading && "cursor-not-allowed"
            } flex items-center justify-center font-bold w-8 h-6 outline-none border rounded-tl-sm rounded-bl-sm border-neutral-800`}
            onClick={handleDecreaseQuantity}
            disabled={isLoading}
          >
            <RiSubtractFill size={20} />
          </button>
          <div className="w-12 h-6 outline-none border border-neutral-800 overflow-hidden flex items-center justify-center">
            <input
              value={tempQuantity}
              type="number"
              name=""
              id=""
              className="w-full h-full border-none outline-none text-center spin-button-none"
              onBlur={handleBlur} // Sử dụng onBlur để thay đổi khi người dùng rời khỏi trường input
              onKeyDown={handleKeyDown}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="button"
            className={`${
              isLoading && "cursor-not-allowed"
            } flex items-center justify-center font-bold w-8 h-6 outline-none border rounded-tr-sm rounded-br-sm border-neutral-800`}
            onClick={handleIncreaseQuantity}
            disabled={isLoading}
          >
            <IoIosAdd size={20} />
          </button>
        </div>
      </div>
      {isShowAlert && (
        <CustomAlertDialog
          title="Bạn chắc chắn muốn xóa?"
          description="Thao tác này sẽ không thể hoàn tác."
          onConfirm={() => handleDelete()}
          onCancel={handleCancel}
          isOpen={isShowAlert}
          onClose={() => setIsShowAlert(false)}
        />
      )}
    </div>
  );
};
export default CartItemForm;
