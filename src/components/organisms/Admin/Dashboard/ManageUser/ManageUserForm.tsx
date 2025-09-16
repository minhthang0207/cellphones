"use client";
import Loading from "@/components/organisms/Loading";
import { getAllUserAdmin } from "@/libStatistic";
import { useEffect, useState } from "react";
import SingleUser from "./SingleUser";

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

const ManageUserForm: React.FC = () => {
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsTableLoading(true);
      const result = await getAllUserAdmin();
      if (result.success) {
        setUsers(result.data.users);
      }
      setIsTableLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h4 className="uppercase text-lg font-bold my-t mb-4">
        Danh sách người dùng
      </h4>
      <div className="bg-white w-full">
        <table
          className={`min-w-full bg-white border border-gray-200 ${
            (users.length === 0 && "h-full") || (isTableLoading && "h-full")
          }`}
        >
          <thead>
            <tr className="bg-red-400">
              <th className="py-2 px-4 border-b rounded-tl-md">STT</th>
              <th className="py-2 px-4 border-b">Họ tên</th>
              <th className="py-2 px-4 border-b">Điện thoại</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Xác thực</th>
              <th className="py-2 px-4 border-b">Quyền</th>
              <th className="py-2 px-4 border-b rounded-tr-md"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isTableLoading ? (
              // Hiển thị vòng tròn xoay khi đang tải
              <tr>
                <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                  <Loading fullWeb={false} />
                </td>
              </tr>
            ) : users && users.length > 0 ? (
              // Hiển thị danh sách khi có dữ liệu
              users.map((item, index) => (
                <SingleUser
                  key={item.id}
                  item={item}
                  index={index}
                  setIsTableLoading={setIsTableLoading}
                  setUsers={setUsers}
                />
              ))
            ) : (
              // Hiển thị thông báo khi không có dữ liệu
              <tr>
                <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                  Không tìm thấy kết quả
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUserForm;
