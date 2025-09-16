import { MdDelete } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isVerify: boolean;
  role: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}
import {
  deleteUserAdmin,
  getAllUserAdmin,
  updateUserAdmin,
} from "@/libStatistic";
import { toast } from "sonner";
import CustomAlertDialog from "@/components/ui/alert-dialog-custom";

interface SingleUserProp {
  item: User;
  index: number;
  setIsTableLoading: (value: boolean) => void; // Kiểu của prop
  setUsers: React.Dispatch<React.SetStateAction<User[]>>; // Kiểu của setUsers
}

const SingleUser: React.FC<SingleUserProp> = ({
  item,
  index,
  setIsTableLoading,
  setUsers,
}) => {
  const [roleSelected, setRoleSelected] = useState(item.role);
  const [isVerifySelected, setIsVerifySelected] = useState(
    item.isVerify ? "1" : "0"
  );
  const [isShowAlert, setIsShowAlert] = useState(false);

  const handleStatusChange = async (
    value: string,
    id: string,
    type: string
  ) => {
    if (type === "role") {
      const result = await updateUserAdmin({ role: value }, id);
      if (result.success) {
        toast.success("Cập nhật quyền người dùng thành công");
        setRoleSelected(value);
      } else {
        toast.error("Có lỗi xảy ra vui lòng thử lại sau");
      }
    } else if (type === "verify") {
      let value1;
      if (value === "1") {
        value1 = true;
      } else {
        value1 = false;
      }
      const result = await updateUserAdmin({ isVerify: value1 }, id);
      if (result.success) {
        toast.success("Cập nhật trạng thái xác thực người dùng thành công");
        setIsVerifySelected(value);
      } else {
        toast.error("Có lỗi xảy ra vui lòng thử lại sau");
      }
    }

    setIsTableLoading(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteUser = async (id: string) => {
    setIsShowAlert(true);
  };

  const handleDelete = async () => {
    setIsTableLoading(true);
    if (item.id) {
      const result = await deleteUserAdmin(item.id);
      if (result.success) {
        const result1 = await getAllUserAdmin();
        if (result1.success) {
          setUsers(result1.data.users);
        }
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    }
    setIsTableLoading(false);
  };

  const handleCancel = () => {
    setIsShowAlert(false); // Đóng dialog
  };

  return (
    <tr key={item.id} className="hover:bg-neutral-200 transition duration-200">
      <td className="py-2 px-4 border-b text-center">{index + 1}</td>
      <td className="py-2 px-4 border-b text-center">{item.name}</td>
      <td className="py-2 px-4 border-b text-center">{item.phone}</td>
      <td className="py-2 px-4 border-b text-center">{item.email}</td>

      <td className="py-2 px-4 border-b text-center">
        <Select
          value={isVerifySelected}
          onValueChange={(value) =>
            handleStatusChange(value, item.id, "verify")
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Xác thực</SelectLabel>
              {listVerify.map((item) => {
                return (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </td>

      <td className="py-2 px-4 border-b text-center">
        <Select
          value={roleSelected}
          onValueChange={(value) => handleStatusChange(value, item.id, "role")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Quyền</SelectLabel>
              {listRole.map((item) => {
                return (
                  <SelectItem key={item.value} value={item.value}>
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
          className="bg-red-500 text-white py-1 px-2 rounded ml-2"
          onClick={() => handleDeleteUser(item.id)}
        >
          <MdDelete size={18} />
        </button>
      </td>
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
    </tr>
  );
};

export default SingleUser;

const listRole = [
  {
    label: "Admin",
    value: "admin",
  },
  {
    label: "User",
    value: "user",
  },
];

const listVerify = [
  {
    label: "Đã xác thực",
    value: "1",
  },
  {
    label: "Chưa xác thực",
    value: "0",
  },
];
