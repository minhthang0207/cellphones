"use client";

import Loading from "@/components/organisms/Loading";
import CustomAlertDialog from "@/components/ui/alert-dialog-custom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createRom, deleteRom, getAllRom, updateRom } from "@/lib";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";

const RomForm: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Rom | null>(null);
  const [capacity, setCapacity] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listRom, setListRom] = useState<Rom[]>([]);
  const [isShowAlert, setIsShowAlert] = useState(false);
  const handleSelectUpdate = (rom: Rom) => {
    setSelectedItem(rom);
    setIsEdit(true);
    setCapacity(rom.capacity.toString());
    setDescription(rom.description || "");
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCapacity(e.target.value);
  };

  const handleChangeDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleDeleteBrand = (rom: Rom) => {
    setIsShowAlert(true);
    setSelectedItem(rom);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    if (selectedItem) {
      const result = await deleteRom(selectedItem.id);
      if (result.success) {
        await fetchRom();
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

    if (!capacity) {
      toast.error("Bạn cần nhập dung lượng rom");
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
      capacity: Number(capacity),
      description,
    };
    if (!isEdit) {
      const result = await createRom(data);
      if (result.success) {
        await fetchRom();
        toast.success("Tạo mới thành công");
      } else {
        toast.error(result.message);
      }
    } else {
      if (selectedItem) {
        const result = await updateRom(data, selectedItem.id);
        if (result.success) {
          toast.success("Cập nhật thành công");
          await fetchRom();
        } else {
          toast.error(result.message);
        }
      }
    }
    setIsLoading(false);
  };
  const fetchRom = async () => {
    setIsLoading(true);
    const result = await getAllRom();
    if (result.success) {
      setListRom(result.data.roms);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRom();
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
              <p className="text-sm">Dung lượng Rom</p>
              <Input
                placeholder=""
                className="border-2"
                value={capacity.toString()}
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
                      setCapacity("");
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
                      setCapacity("");
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
          <table className=" min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-red-400 ">
                <th className="py-2 px-4 border-b rounded-tl-md">STT</th>
                <th className="py-2 px-4 border-b ">Dung lượng</th>
                <th className="py-2 px-4 border-b">Ghi chú</th>
                <th className="py-2 px-4 border-b">Slug</th>
                <th className="py-2 px-4 border-b rounded-tr-md"></th>
              </tr>
            </thead>
            <tbody className="text-sm ">
              {listRom?.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-neutral-200 transition duration-200"
                >
                  <td className="py-2 px-4 border-b text-center">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {item.capacity}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {item.description}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {item.slug}
                  </td>

                  <td className="py-2 px-4 border-b">
                    <button
                      className="bg-blue-500 text-white py-1 px-2 rounded"
                      onClick={() => handleSelectUpdate(item)}
                    >
                      <CiEdit size={18} />
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-2 rounded ml-2"
                      onClick={() => handleDeleteBrand(item)}
                    >
                      <MdDelete size={18} />
                    </button>
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

export default RomForm;
