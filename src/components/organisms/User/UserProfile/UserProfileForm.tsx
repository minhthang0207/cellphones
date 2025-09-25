"use client";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { updateUserInfo, updateUserLocation } from "@/lib";
import Loading from "../../Loading";
import CalendarCustom from "@/components/ui/calendarCustom";
import { Combobox } from "@/components/ui/combobox";
import { CiLogout } from "react-icons/ci";


const UserProfileForm: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  const [date, setDate] = useState<Date | null>(null);
  const [gender, setGender] = useState<string>("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [tempUrl, setTempUrl] = useState<string | null>(null); // Để lưu URL tạm thời
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationID, setLocationID] = useState({
    province: "",
    district: "",
    ward: "",
  });

  const [locationValue, setLocationValue] = useState({
    province: "",
    district: "",
    ward: "",
  });

  const [address, setAddress] = useState("");

  const [provinceData, setProvinceData] = useState<Provinces[]>([]);
  const [districtData, setDistrictData] = useState<Districts[]>([]);
  const [wardsData, setWardsData] = useState<Wards[]>([]);

  const router = useRouter();
  const logout = useUserStore((state) => state.logout)
    const handleLogout = () => {
      logout();
      router.push("/");
    };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const previewURL = URL.createObjectURL(file);
      setAvatar(previewURL);
      setTempUrl(previewURL);
    }
  };

  const handleCancel = () => {
    if (user) {
      setDate(user.birth ? new Date(user.birth) : null); // Cập nhật date nếu có
      setGender(user.gender ? "true" : "false"); // Cập nhật gender
      setName(user.name || ""); // Cập nhật name, nếu không có tên thì đặt là chuỗi rỗng
      setAvatar(user.avatar || "");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Xóa giá trị file trong input
      }
    }
  };

  const validateFormInfo = () => {
    if (!gender) {
      toast.error("Bạn cần cập nhật giới tính");
      return false;
    }
    if (!name) {
      toast.error("Bạn cần cập nhật họ tên");
      return false;
    }
    if (!date) {
      toast.error("Bạn cần cập nhật ngày sinh");
      return false;
    }
    return true;
  };

  const handleSubmitInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateFormInfo()) {
      return;
    }
    let result = null;
    setIsLoading(true);
    if (date && !file) {
      result = await updateUserInfo(name, gender, date);
    } else if (date && file) {
      result = await updateUserInfo(name, gender, date, file);
    }
    setIsLoading(false);
    if (result) {
      if (result.success) {
        updateUser(result.data.updatedUser);
        toast.success(result.message);
      }
    }
  };

  const validateFormLocation = () => {
    if (!locationValue.province) {
      toast.error("Bạn cần nhập Tỉnh/Thành");
      return false;
    }
    if (!locationValue.district) {
      toast.error("Bạn cần nhập Quận/Huyện");
      return false;
    }
    if (!locationValue.ward) {
      toast.error("Bạn cần nhập Phường/Xã");
      return false;
    }
    if (!address || address.length < 3) {
      toast.error("Bạn cần nhập Số nhà/tên đường. Ít nhất 3 ký tự");
      return false;
    }
    return true;
  };

  const handleSubmitLocation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateFormLocation()) {
      return;
    }
    setIsLoading(true);
    const data = {
      province: locationValue.province,
      district: locationValue.district,
      ward: locationValue.ward,
      address,
    };
    const result = await updateUserLocation(data);
    if (result) {
      updateUser(result.data.updatedUser);
      toast.success(result.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const getProvinceData = async () => {
      try {
        const response = await fetch(
          "https://open.oapi.vn/location/provinces?size=63"
        );
        const result = await response.json();
        setProvinceData(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getProvinceData();
  }, []);

  const getDistrictData = async (id: string) => {
    try {
      const response = await fetch(
        `https://open.oapi.vn/location/districts/${id}`
      );
      const result = await response.json();
      setDistrictData(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getWardData = async (id: string) => {
    try {
      const response = await fetch(`https://open.oapi.vn/location/wards/${id}`);
      const result = await response.json();

      setWardsData(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleProvinceSelect = async (selected: Provinces) => {
    setIsLoading(true);
    setLocationID({
      province: selected.id,
      district: "",
      ward: "",
    });
    setLocationValue({
      province: selected.name,
      district: "",
      ward: "",
    });

    setDistrictData([]);

    await getDistrictData(selected.id);
    setIsLoading(false);
  };

  const handleDistrictSelect = async (selected: Districts) => {
    setIsLoading(true);

    setLocationID({
      ...locationID,
      district: selected.id,
      ward: "",
    });
    setLocationValue({
      ...locationValue,
      district: selected.name,
      ward: "",
    });
    setWardsData([]);

    await getWardData(selected.id);
    setIsLoading(false);
  };

  const handleWardSelect = (selected: Wards) => {
    setLocationID({
      ...locationID, // Preserve existing values
      ward: selected.id,
    });
    setLocationValue({
      ...locationValue,
      ward: selected.name,
    });
  };

  useEffect(() => {
    return () => {
      if (tempUrl) {
        URL.revokeObjectURL(tempUrl);
      }
    };
  }, [tempUrl]);

  useEffect(() => {
    if (user) {
      setDate(user.birth ? new Date(user.birth) : null); // Cập nhật date nếu có
      setGender(user.gender ? "true" : "false"); // Cập nhật gender
      setName(user.name || ""); // Cập nhật name, nếu không có tên thì đặt là chuỗi rỗng
      setAvatar(user.avatar || "");

      if (user.address) {
        const address = user?.address.split(", ");
        setLocationValue({
          province: address[3],
          district: address[2],
          ward: address[1],
        });
        setAddress(address[0]);
      }
    }
  }, [user]); // Chạy lại mỗi khi user thay đổi

  if (isLoading) {
    return <Loading hasOverLay={true} />;
  }
  return (
    <div className="flex flex-col gap-6">
      <p className="font-medium text-neutral-700 text-xl p-2">
        Thông tin tài khoản
      </p>
      <div className="border rounded-lg p-4">
        <p className="text-base font-bold uppercase">Thông tin cá nhân</p>
        <p className="mt-5">Số điện thoại - {user.phone}</p>
        <form
          className="flex flex-col gap-4 bg-neutral-100 p-4 rounded-lg mt-4"
          onSubmit={handleSubmitInfo}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 sm:items-center mb-2">
              {avatar && (
                <Image
                  src={avatar}
                  width={80}
                  height={80}
                  alt="Ảnh đại diện"
                  className="aspect-square rounded-full object-cover bg-white"
                />
              )}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture" className="text-base">
                  Đổi ảnh đại diện
                </Label>
                <Input
                  ref={fileInputRef}
                  id="picture"
                  type="file"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-10">
            <RadioGroup
              value={String(gender)}
              onValueChange={(value) => setGender(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="gender-male" />
                <Label htmlFor="gender-male">Nam</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="gender-female" />
                <Label htmlFor="gender-female">Nữ</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            <div className="flex gap-2 flex-col sm:gap-4 sm:flex-row sm:items-baseline">
              <p className="whitespace-nowrap">Họ & Tên</p>
              <Input
                className="border rounded-lg"
                value={name}
                onChange={(e) => handleChangeName(e)}
              />
            </div>
            <div className="flex gap-2 flex-col sm:gap-4 sm:flex-row sm:items-baseline">
              <p className="whitespace-nowrap">Sinh nhật</p>
              <CalendarCustom date={date} setDate={setDate} />
            </div>
          </div>
          <div className="flex gap-6 justify-center">
            <button
              type="button"
              className="flex justify-center w-fit px-4 py-1 mt-2  rounded-lg font-semibold text-neutral-500"
              onClick={handleCancel}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex justify-center w-fit px-4 py-1 mt-2  border border-red-500 rounded-lg font-semibold text-red-500"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>

      <div className="border rounded-lg p-4">
        <p className="text-base font-bold uppercase">Địa chỉ nhận hàng</p>
        <form className="mt-4 " onSubmit={handleSubmitLocation}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Combobox<Provinces>
              selectedItem={locationValue.province}
              data={provinceData}
              label="Chọn Tỉnh, Thành"
              placeholder="Tìm kiếm Tỉnh, Thành"
              handleSelect={handleProvinceSelect}
            />

            <Combobox<Districts>
              selectedItem={locationValue.district}
              data={districtData}
              label="Chọn Quận/Huyện"
              placeholder="Tìm kiếm Quận/Huyện"
              handleSelect={handleDistrictSelect}
            />
            <Combobox<Wards>
              selectedItem={locationValue.ward}
              data={wardsData}
              label="Chọn Phường/Xã"
              placeholder="Tìm kiếm Phường/Xã"
              handleSelect={handleWardSelect}
            />
            <Input
              className="border rounded-lg"
              value={address}
              placeholder="Số nhà, tên đường"
              onChange={(e) => handleChangeAddress(e)}
            />
          </div>
          <button
            type="submit"
            className="flex justify-center w-fit px-4 py-1 mt-6  border border-red-500 rounded-lg font-semibold text-red-500 mx-auto"
          >
            Cập nhật
          </button>
        </form>
      </div>
      <button
          type="button"
          className="flex md:hidden justify-center mb-4 rounded-lg items-center gap-2  p-2 text-neutral-700 borde font-semibold transition duration-300"
          onClick={() => handleLogout()}
        >
          <CiLogout size={20} /> Đăng xuất
        </button>
    </div>
  );
};
export default UserProfileForm;
