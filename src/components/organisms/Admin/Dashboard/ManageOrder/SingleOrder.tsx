import { BiDetail } from "react-icons/bi";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { updateOrder } from "@/lib";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ListFilter {
  label: string;
  value: string;
}

interface SingleOrderProps {
  item: Order;
  index: number;
  listFilter: ListFilter[];
  isTableLoading: boolean;
  setIsTableLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const SingleOrder: React.FC<SingleOrderProps> = ({
  item,
  index,
  listFilter,
  setIsTableLoading,
}) => {
  const [statusSelected, setStatusSelected] = useState(item.status);
  const router = useRouter();

  const handleStatusChange = async (value: string, id: string) => {
    // setIsTableLoading(true);
    setStatusSelected(value); // Cập nhật trạng thái đã chọn

    const result = await updateOrder({ orderId: id, status: value });
    if (result.success) {
      toast.success("Cập nhật trạng thái đơn hàng thành công");
    } else {
      toast.error("Có lỗi xảy ra vui lòng thử lại sau");
    }
    setIsTableLoading(false);
  };
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString); // Tạo đối tượng Date từ chuỗi

    // Lấy ngày, tháng, năm
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    // Lấy giờ, phút, giây
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    // Trả về chuỗi định dạng "dd/mm/yyyy hh:mm:ss"
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {}, []);
  return (
    <tr key={item.id} className="hover:bg-neutral-200 transition duration-200">
      <td className="py-2 px-4 border-b text-center">{index + 1}</td>
      <td className="py-2 px-4 border-b text-center">{item.id}</td>
      <td className="py-2 px-4 border-b text-center">{item.payment_method}</td>
      <td className="py-2 px-4 border-b text-center">{item.payment_status}</td>
      <td className="py-2 px-4 border-b text-center">
        {formatDateTime(item.createdAt)}
      </td>
      <td className="py-2 px-4 border-b text-center">
        <Select
          value={statusSelected}
          onValueChange={(value) => handleStatusChange(value, item.id)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Trạng thái đơn hàng</SelectLabel>
              {listFilter.map((item) => {
                return (
                  <SelectItem key={item.value} value={item.label}>
                    {item.label}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </td>
      <td className="py-2 px-4 border-b text-center">
        <button
          className="bg-blue-500 text-white py-1 px-2 rounded"
          onClick={() => {
            router.push(`/dashboard-admin/don-hang/${item.id}`);
          }}
        >
          <BiDetail size={18} />
        </button>
      </td>
    </tr>
  );
};
export default SingleOrder;
