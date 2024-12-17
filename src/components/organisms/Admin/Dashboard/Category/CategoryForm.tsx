"use client";

import Loading from "@/components/organisms/Loading";
import CustomAlertDialog from "@/components/ui/alert-dialog-custom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "@/lib";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

const CategoryForm: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Category | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [listCategory, setListCategory] = useState<Category[]>([]);
  const [isShowAlert, setIsShowAlert] = useState(false);
  const handleSelectUpdate = (category: Category) => {
    setSelectedItem(category);
    setIsEdit(true);
    setName(category.name);
    setDescription(category.description);
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleDeleteCategory = (category: Category) => {
    setIsShowAlert(true);
    setSelectedItem(category);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    if (selectedItem) {
      const result = await deleteCategory(selectedItem.id);
      if (result.success) {
        await fetchCategory();
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

  const validate = () => {
    let valid = true;

    if (!name) {
      toast.error("Bạn cần nhập tên loại sản phẩm");
      valid = false;
    }

    return valid;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    setIsLoading(true);
    const data = {
      name,
      description,
    };
    if (!isEdit) {
      const result = await createCategory(data);
      if (result.success) {
        await fetchCategory();
        toast.success("Tạo mới thành công");
      } else {
        toast.error(result.message);
      }
    } else {
      if (selectedItem) {
        const result = await updateCategory(data, selectedItem.id);
        if (result.success) {
          toast.success("Cập nhật thành công");
          await fetchCategory();
        } else {
          toast.error(result.message);
        }
      }
    }
    setIsLoading(false);
  };
  const fetchCategory = async () => {
    setIsTableLoading(true);
    const result = await getAllCategory();
    if (result.success) {
      setListCategory(result.data.categories);
    }
    setIsTableLoading(false);
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  if (isLoading) {
    return <Loading hasOverLay={true} />;
  }

  return (
    <div className="p-4">
      <div className="flex gap-4">
        <div className="bg-white w-[30%] rounded-tl-md rounded-tr-md">
          <form className="p-4 flex flex-col gap-4" onSubmit={handleSubmit}>
            <h5 className="font-bold text-sm uppercase mb-2">
              Thông tin thuộc tính
            </h5>
            <div>
              <p className="text-sm">Tên loại sản phẩm</p>
              <Input
                placeholder=""
                className="border-2"
                value={name}
                onChange={(e) => handleChangeName(e)}
              />
            </div>
            <div>
              <p className="text-sm">Ghi chú</p>
              <Textarea value={description} onChange={handleChangeDesc} />
            </div>
            <div className="">
              {!isEdit ? (
                <div className="grid grid-cols-2 text-white text-sm gap-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 rounded-md"
                  >
                    Tạo mới
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 rounded-md"
                    onClick={() => {
                      setName("");
                      setDescription("");
                    }}
                  >
                    Làm mới
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 text-white text-sm">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 rounded-md"
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-400 rounded-md"
                    onClick={() => {
                      setSelectedItem(null);
                      setName("");
                      setDescription("");
                      setIsEdit(false);
                    }}
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
        <div className="bg-white w-[70%]">
          <table
            className={`min-w-full bg-white border border-gray-200 ${
              (listCategory.length === 0 && "h-full") ||
              (isTableLoading && "h-full")
            }`}
          >
            <thead>
              <tr className="bg-red-400">
                <th className="py-2 px-4 border-b rounded-tl-md">STT</th>
                <th className="py-2 px-4 border-b">Tên loại sản phẩm</th>
                <th className="py-2 px-4 border-b">Ghi chú</th>
                <th className="py-2 px-4 border-b">Slug</th>
                <th className="py-2 px-4 border-b rounded-tr-md"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isTableLoading ? (
                // Hiển thị vòng tròn xoay khi đang tải
                <tr>
                  <td
                    colSpan={5}
                    className="py-4 px-4 text-center text-gray-500"
                  >
                    <Loading fullWeb={false} />
                  </td>
                </tr>
              ) : listCategory && listCategory.length > 0 ? (
                // Hiển thị danh sách khi có dữ liệu
                listCategory.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-neutral-200 transition duration-200"
                  >
                    <td className="py-2 px-4 border-b text-center">
                      {index + 1}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {item.name}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {item.description}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {item.slug}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <button
                        className="bg-blue-500 text-white py-1 px-2 rounded"
                        onClick={() => handleSelectUpdate(item)}
                      >
                        <CiEdit size={18} />
                      </button>
                      <button
                        className="bg-red-500 text-white py-1 px-2 rounded ml-2"
                        onClick={() => handleDeleteCategory(item)}
                      >
                        <MdDelete size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                // Hiển thị thông báo khi không có dữ liệu
                <tr>
                  <td
                    colSpan={5}
                    className="py-4 px-4 text-center text-gray-500"
                  >
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
    </div>
  );
};

export default CategoryForm;
