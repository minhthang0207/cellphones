"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { FaTree, FaLightbulb } from "react-icons/fa6";
import { PiLightbulbFilamentFill } from "react-icons/pi";
import { signup } from "@/lib";
import { useRouter } from "next/navigation";
const RegisterForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });
  const router = useRouter();

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    input: string
  ) => {
    setData({ ...data, [input]: e.target.value });
    if (e.target.value.length > 0) {
      setErrors((prev) => ({
        ...prev,
        [input]: "",
      }));
      setError("");
    }
  };

  const validate = () => {
    let valid = true;
    const newError = {
      name: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirm: "",
    };
    if (!data.name) {
      newError.name = "Bạn cần nhập họ tên";
      valid = false;
    }
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      newError.email = "Email không hợp lệ";
      valid = false;
    }
    if (!data.password) {
      newError.password = "Bạn cần nhập mật khẩu";
      valid = false;
    }
    if (!data.passwordConfirm) {
      newError.passwordConfirm = "Bạn cần nhập để xác nhận lại mật khẩu";
      valid = false;
    }

    setErrors(newError);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    const result = await signup(data);

    setIsLoading(false);
    if (!result.success) {
      setError(result.message);
    } else {
      return router.push("/login");
    }
  };
  return (
    <div className="bg-blue-100 py-8 h-fit">
      <div className="max-w-[1280px] mx-auto">
        <div className="  flex items-center justify-center">
          <div className="border rounded-lg flex flex-col gap-4 w-1/2 h-fit p-4 bg-white">
            <div className="flex justify-between items-center">
              <p className="mb-2 text-2xl ">Đăng ký</p>
              <div className="flex items-center gap-4">
                <FaTree size={20} className="text-green-600" />
                <PiLightbulbFilamentFill
                  size={20}
                  className="text-yellow-500"
                />
                <FaLightbulb size={20} className="text-red-600" />
                <PiLightbulbFilamentFill
                  size={20}
                  className="text-yellow-500"
                />
                <FaTree size={20} className="text-green-600" />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/login_image.png"
                width={200}
                height={200}
                alt="hinh anh"
              />
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <Input
                  placeholder="Họ và tên"
                  className="border-2"
                  value={data.name}
                  require={true}
                  onChange={(e) => handleChangeInput(e, "name")}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name}</p>
                )}
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Địa chỉ emali"
                  className="border-2 "
                  value={data.email}
                  require={true}
                  onChange={(e) => handleChangeInput(e, "email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>
              <div>
                <Input
                  placeholder="Số điện thoại"
                  className="border-2 "
                  value={data.phone}
                  onChange={(e) => handleChangeInput(e, "phone")}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs">{errors.phone}</p>
                )}
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Mật khẩu"
                  className="border-2"
                  value={data.password}
                  require={true}
                  onChange={(e) => handleChangeInput(e, "password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  className="border-2"
                  value={data.passwordConfirm}
                  require={true}
                  onChange={(e) => handleChangeInput(e, "passwordConfirm")}
                />
                {errors.passwordConfirm && (
                  <p className="text-red-500 text-xs">
                    {errors.passwordConfirm}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <Button
                  className="bg-red-600 hover:bg-red-500"
                  isLoading={isLoading}
                >
                  Đăng Ký
                </Button>
                {error && (
                  <p className="text-red-500 text-sm text-center mt-4 block">
                    {error}
                  </p>
                )}
              </div>
              <div className="mx-auto">
                <span className="text-sm text-neutral-400">
                  Bạn đã có tài khoản?
                </span>
                <Link href="/login">
                  <Button variant="link" className="text-sm px-2 text-red-600">
                    Đăng nhập
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
