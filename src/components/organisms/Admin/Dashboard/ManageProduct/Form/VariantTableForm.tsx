import Loading from "@/components/organisms/Loading";
import CustomAlertDialog from "@/components/ui/alert-dialog-custom";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createVariant,
  deleteVariant,
  getAllColor,
  getAllRam,
  getAllRom,
  getAllVariantByProductId,
  updateVariant,
} from "@/lib";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";

interface VariantTableFormProps {
  id: string;
}

const VariantTableForm: React.FC<VariantTableFormProps> = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [listRam, setListRam] = useState<Ram[]>([]);
  const [listRom, setListRom] = useState<Rom[]>([]);
  const [listColor, setListColor] = useState<Color[]>([]);
  const [listVariant, setListVariant] = useState<Variant[]>([]);
  const [selectedItem, setSelectedItem] = useState<Variant | null>(null);

  const [data, setData] = useState({
    name: "",
    stock_quantity: 0,
    price: 0,
    color_id: "",
    ram_id: "",
    rom_id: "",
    product_id: id,
  });
  const [isShowAlert, setIsShowAlert] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleSelectUpdate = (variant: Variant) => {
    setSelectedItem(variant);
    setIsEdit(true);
    setData((prevData) => ({
      ...prevData, // sao chép dữ liệu cũ
      name: variant.name || "",
      stock_quantity: variant.stock_quantity || 0,
      price: variant.price || 0,
      color_id: variant.color_id || "",
      ram_id: variant.ram_id || "",
      rom_id: variant.rom_id || "",
    }));
  };

  const handleDeleteVariant = (variant: Variant) => {
    setIsShowAlert(true);
    setSelectedItem(variant);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    if (selectedItem) {
      const result = await deleteVariant(selectedItem.id);
      if (result.success) {
        await fetchVariants();
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

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const { value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [field]: value, // Cập nhật đúng field trong data
    }));
  };

  const handleRamChange = (value: string) => {
    setData({
      ...data,
      ram_id: value,
    });
  };

  const handleRomChange = (value: string) => {
    setData({
      ...data,
      rom_id: value,
    });
  };

  const handleColorChange = (value: string) => {
    setData({
      ...data,
      color_id: value,
    });
  };

  const validate = () => {
    if (!data.name) {
      toast.error("Bạn cần nhập tên biến thể sản phẩm");
      return false;
    }
    if (!data.price) {
      toast.error("Bạn cần nhập giá biến thể sản phẩm");
      return false;
    }
    if (!data.stock_quantity) {
      toast.error("Bạn cần nhập số lượng tồn biến thể sản phẩm");
      return false;
    }
    if (!data.color_id) {
      toast.error("Bạn cần chọn màu sắc cho biến thể");
      return false;
    }

    if (!data.ram_id) {
      toast.error("Bạn cần chọn dung lượng ram cho biến thể");
      return false;
    }

    if (!data.ram_id) {
      toast.error("Bạn cần chọn dung lượng rom cho biến thể");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsLoading(true);

    if (!isEdit) {
      const result = await createVariant(data);
      if (result.success) {
        await fetchVariants();
        setData({
          name: "",
          stock_quantity: 0,
          price: 0,
          color_id: "",
          ram_id: "",
          rom_id: "",
          product_id: id,
        });
        toast.success("Tạo mới thành công");
      } else {
        toast.error(result.message);
      }
    } else {
      if (selectedItem) {
        const result = await updateVariant(data, selectedItem.id);
        if (result.success) {
          await fetchVariants();
          setData({
            name: "",
            stock_quantity: 0,
            price: 0,
            color_id: "",
            ram_id: "",
            rom_id: "",
            product_id: id,
          });
          toast.success("Cập nhật thành công");
        } else {
          toast.error(result.message);
        }
      }
    }
    setIsLoading(false);
  };

  const fetchVariants = async () => {
    setIsLoading(true);

    if (id) {
      const result = await getAllVariantByProductId(id);
      setListVariant(result.data.variants);
    }

    setIsLoading(false); // Đặt trạng thái tải xong
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Gọi API thương hiệu và danh mục song song
      const [colorResult, ramResult, romResult] = await Promise.all([
        getAllColor(),
        getAllRam(),
        getAllRom(),
      ]);

      setListColor(colorResult.data.colors);
      setListRam(ramResult.data.rams);
      setListRom(romResult.data.roms);

      if (id) {
        const result = await getAllVariantByProductId(id);
        setListVariant(result.data.variants);
      }

      setIsLoading(false); // Đặt trạng thái tải xong
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    console.log("Data updated:", data);
  }, [data]);
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white  rounded-tl-md rounded-tr-md">
        <h5 className="font-bold text-base mb-2">Thông tin biến thể</h5>
        <form className="p-4 grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div>
            <p className="text-sm mb-1.5">Tên biến thể</p>
            <Input
              placeholder=""
              className="border-2"
              value={data.name || ""}
              onChange={(e) => handleChangeInput(e, "name")}
            />
          </div>
          <div>
            <p className="mb-1.5 text-sm">Số lượng tồn kho</p>
            <Input
              type="number"
              value={data.stock_quantity.toString() || "0"}
              className="border-2"
              onChange={(e) => handleChangeInput(e, "stock_quantity")}
              placeholder=""
            />
          </div>
          <div>
            <p className="mb-1.5 text-sm">Giá</p>
            <Input
              type="number"
              value={data.price.toString() || "0"}
              className="border-2"
              onChange={(e) => handleChangeInput(e, "price")}
              placeholder=""
            />
          </div>
          <div>
            <p className="mb-1.5 text-sm">Màu sắc</p>
            <Select value={data.color_id} onValueChange={handleColorChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn màu sắc" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Màu sắc</SelectLabel>
                  {listColor?.map((item) => {
                    return (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="mb-1.5 text-sm">Dung lượng ram</p>
            <Select value={data.ram_id} onValueChange={handleRamChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn dung lượng ram" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Ram</SelectLabel>
                  {listRam?.map((item) => {
                    return (
                      <SelectItem key={item.id} value={item.id}>
                        {item.capacity}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="mb-1.5 text-sm">Dung lượng rom</p>
            <Select value={data.rom_id} onValueChange={handleRomChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn dung lượng rom" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Rom</SelectLabel>
                  {listRom?.map((item) => {
                    return (
                      <SelectItem key={item.id} value={item.id}>
                        {item.capacity}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end w-full">
            {!isEdit ? (
              <div className="w-full grid grid-cols-2 text-white text-sm gap-4">
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
                    setData({
                      name: "",
                      stock_quantity: 0,
                      price: 0,
                      color_id: "",
                      ram_id: "",
                      rom_id: "",
                      product_id: id,
                    });
                  }}
                >
                  Làm mới
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-white text-sm w-full">
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
                    setData({
                      name: "",
                      stock_quantity: 0,
                      price: 0,
                      color_id: "",
                      ram_id: "",
                      rom_id: "",
                      product_id: id,
                    });
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
      <div className="bg-white ">
        <table
          className={` min-w-full bg-white border border-gray-200 ${
            (listVariant.length === 0 && "h-full") || (isLoading && "h-full")
          }`}
        >
          <thead>
            <tr className="bg-red-400 ">
              <th className="py-2 px-4 border-b rounded-tl-md">STT</th>
              <th className="py-2 px-4 border-b ">Tên biến thể</th>
              <th className="py-2 px-4 border-b">Số lượng tồn</th>
              <th className="py-2 px-4 border-b">Giá</th>
              <th className="py-2 px-4 border-b">Màu sắc</th>
              <th className="py-2 px-4 border-b">Dung lượng Ram</th>
              <th className="py-2 px-4 border-b">Dung lượng Rom</th>
              <th className="py-2 px-4 border-b rounded-tr-md"></th>
            </tr>
          </thead>
          <tbody className="text-sm ">
            {isLoading ? (
              // Hiển thị vòng tròn xoay khi đang tải
              <tr>
                <td colSpan={8} className="py-4 px-4 text-center text-gray-500">
                  <Loading fullWeb={false} />
                </td>
              </tr>
            ) : (
              listVariant?.map((item, index) => (
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
                    {Number(item.stock_quantity).toLocaleString("vi-en")}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {Number(item.price).toLocaleString("vi-en")}đ
                  </td>

                  <td className="py-2 px-4 border-b text-center">
                    {item.Color.name}
                  </td>

                  <td className="py-2 px-4 border-b text-center">
                    {item.Ram.capacity}
                  </td>

                  <td className="py-2 px-4 border-b text-center">
                    {item.Rom.capacity}
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
                      onClick={() => handleDeleteVariant(item)}
                    >
                      <MdDelete size={18} />
                    </button>
                  </td>
                </tr>
              ))
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
export default VariantTableForm;
