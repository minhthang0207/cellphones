"use client";

import Loading from "@/components/organisms/Loading";
import CustomAlertDialog from "@/components/ui/alert-dialog-custom";
import { Input } from "@/components/ui/input";
import { createColor, deleteColor, getAllColor, updateColor } from "@/lib";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";

const ColorForm: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Color | null>(null);
  const [name, setName] = useState<string>("");
  const [code, setCode] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listColor, setListColor] = useState<Color[]>([]);
  const [isShowAlert, setIsShowAlert] = useState(false);

  const handleSelectUpdate = (color: Color) => {
    setSelectedItem(color);
    setIsEdit(true);
    setName(color.name);
    setCode(color.code);
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleDeleteBrand = (color: Color) => {
    setIsShowAlert(true);
    setSelectedItem(color);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    if (selectedItem) {
      const result = await deleteColor(selectedItem.id);
      if (result.success) {
        await fetchColor();
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
      toast.error("Bạn cần nhập tên màu sắc");
      valid = false;
    }

    if (!code) {
      toast.error("Bạn cần chọn mã màu sắc");
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
      code,
    };
    if (!isEdit) {
      const result = await createColor(data);
      if (result.success) {
        await fetchColor();
        toast.success("Tạo mới thành công");
      } else {
        toast.error(result.message);
      }
    } else {
      if (selectedItem) {
        const result = await updateColor(data, selectedItem.id);
        if (result.success) {
          toast.success("Cập nhật thành công");
          await fetchColor();
        } else {
          toast.error(result.message);
        }
      }
    }
    setIsLoading(false);
  };
  const fetchColor = async () => {
    setIsLoading(true);
    const result = await getAllColor();
    if (result.success) {
      setListColor(result.data.colors);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchColor();
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
              <p className="text-sm">Tên màu sắc</p>
              <Input
                placeholder=""
                className="border-2"
                value={name}
                onChange={(e) => handleChangeName(e)}
              />
            </div>
            <div>
              <p className="text-sm">Mã màu sắc</p>
              <Input
                type="color"
                placeholder=""
                className="border-2"
                value={code}
                onChange={(e) => handleChangeCode(e)}
              />
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
                      setCode("");
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
                      setCode("");
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
          <table className=" min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-red-400 ">
                <th className="py-2 px-4 border-b rounded-tl-md">STT</th>
                <th className="py-2 px-4 border-b ">Tên màu sắc</th>
                <th className="py-2 px-4 border-b">Mã màu sắc</th>
                <th className="py-2 px-4 border-b">Slug</th>
                <th className="py-2 px-4 border-b rounded-tr-md"></th>
              </tr>
            </thead>
            <tbody className="text-sm ">
              {listColor?.map((item, index) => (
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
                  <td className="py-2 px-4 border-b text-center ">
                    <div className="flex items-center gap-2 justify-center">
                      <span>{item.code}</span>
                      <div
                        className="w-8 h-4 rounded-sm "
                        style={{ backgroundColor: item.code }}
                      ></div>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {item.slug}
                  </td>

                  <td className="py-2 px-4 border-b">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="bg-blue-500 text-white py-1 px-2 rounded"
                        onClick={() => handleSelectUpdate(item)}
                      >
                        <CiEdit size={18} />
                      </button>
                      <button
                        className="bg-red-500 text-white py-1 px-2 rounded"
                        onClick={() => handleDeleteBrand(item)}
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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

export default ColorForm;
