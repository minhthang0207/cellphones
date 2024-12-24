"use client";

import Loading from "@/components/organisms/Loading";
import CustomAlertDialog from "@/components/ui/alert-dialog-custom";
import { deleteProduct, getAllProduct } from "@/lib";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";

const ManageProductForm: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [listProduct, setListProduct] = useState<Product[]>([]);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowAlert, setIsShowAlert] = useState(false);
  const router = useRouter();

  const handleDeleteProduct = (product: Product) => {
    setIsShowAlert(true);
    setSelectedItem(product);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    if (selectedItem) {
      const result = await deleteProduct(selectedItem.id);
      if (result.success) {
        await fetchProduct();
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    }
    setIsLoading(false);
  };

  const handleCancel = () => {
    setSelectedItem(null);
    setIsShowAlert(false); // Đóng dialog
  };

  const handleCreateProduct = () => {
    router.push("/dashboard-admin/san-pham/form");
  };

  const handleUpdate = (id: string) => {
    router.push(`/dashboard-admin/san-pham/form?id=${id}`);
  };

  const fetchProduct = async () => {
    const result = await getAllProduct();
    if (result.success) {
      setListProduct(result.data.products);
    }
  };

  useEffect(() => {
    setIsTableLoading(true);

    fetchProduct();
    setIsTableLoading(false);
  }, []);

  if (isLoading) {
    return <Loading hasOverLay={true} />;
  }
  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h4 className="uppercase text-lg font-bold">Danh sách sản phẩm</h4>
        <button
          type="button"
          className="px-4 py-2 bg-red-400 rounded-lg text-white hover:bg-red-500 transition duration-300"
          onClick={handleCreateProduct}
        >
          Tạo mới
        </button>
      </div>
      <div className="bg-white">
        <table
          className={`min-w-full bg-white border border-gray-200 ${
            (listProduct.length === 0 && "h-full") ||
            (isTableLoading && "h-full")
          }`}
        >
          <thead>
            <tr className="bg-red-400">
              <th className="py-2 px-4 border-b rounded-tl-md">STT</th>
              <th className="py-2 px-4 border-b">Hình ảnh</th>
              <th className="py-2 px-4 border-b">Tên sản phẩm</th>
              <th className="py-2 px-4 border-b">Xuất xứ</th>
              <th className="py-2 px-4 border-b">Giá</th>
              <th className="py-2 px-4 border-b rounded-tr-md"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isTableLoading ? (
              // Hiển thị vòng tròn xoay khi đang tải
              <tr>
                <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
                  <Loading fullWeb={false} />
                </td>
              </tr>
            ) : listProduct && listProduct.length > 0 ? (
              // Hiển thị danh sách khi có dữ liệu
              listProduct.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-neutral-200 transition duration-200"
                >
                  <td className="py-2 px-4 border-b text-center">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <div className="flex justify-center">
                      <div className="w-12 h-12 relative">
                        <Image
                          src={item.image}
                          alt={`Ảnh sản phẩm ${index + 1}`}
                          className="w-full h-full object-cover rounded-md"
                          fill // Tự động phù hợp kích thước theo container
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {item.name}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {item.origin}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {Number(item.price).toLocaleString("vi-en")}đ
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      className="bg-blue-500 text-white py-1 px-2 rounded"
                      onClick={() => {
                        handleUpdate(item.id);
                      }}
                    >
                      <CiEdit size={18} />
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-2 rounded ml-2"
                      onClick={() => handleDeleteProduct(item)}
                    >
                      <MdDelete size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              // Hiển thị thông báo khi không có dữ liệu
              <tr>
                <td colSpan={5} className="py-4 px-4 text-center text-gray-500">
                  Không tìm thấy kết quả
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
    </div>
  );
};

export default ManageProductForm;
