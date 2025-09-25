"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaTree, FaLightbulb } from "react-icons/fa6";
import { PiLightbulbFilamentFill } from "react-icons/pi";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { resetPassword } from "@/lib";
import { useRouter } from "next/navigation";

interface PaymentDetailProps {
  token: string;
}

const ResetPasswordForm: React.FC<PaymentDetailProps> = ({ token }) => {
  const router = useRouter();
  const [errors, setErrors] = useState({
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    input: string
  ) => {
    if (input === "password") {
      setPassword(e.target.value);
    } else {
      setPasswordConfirm(e.target.value);
    }
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
    const newErrors = {
      password: "",
      passwordConfirm: "",
    };
    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
      valid = false;
    }

    if (!passwordConfirm) {
      newErrors.passwordConfirm = "Vui lòng nhập mật khẩu xác nhận";
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

    const result = await resetPassword(token, password, passwordConfirm);

    setIsLoading(false);
    if (!result.success) {
      setError(result.message);
    } else {
      return router.push("/");
    }
  };

  return (
    <div className="bg-blue-100 py-8 h-[calc(100vh-64px)]">
      <div className="mx-autow-[90%] sm:w-[60%] lg:w-[40%]">
        <div className="w-full">
          <div className="border rounded-lg flex flex-col gap-4 w-full h-fit p-4 bg-white">
            <div className="flex justify-between items-center">
              <p className="mb-2 text-2xl">THAY ĐỔI MẬT KHẨU</p>
              <div className="flex items-center gap-4">
                <PiLightbulbFilamentFill
                  size={20}
                  className="text-yellow-500 bulb-2"
                />
                <FaTree size={20} className="text-green-600" />
                <FaLightbulb size={20} className="text-red-600 bulb-1" />
                <FaTree size={20} className="text-green-600 " />
                <PiLightbulbFilamentFill
                  size={20}
                  className="text-yellow-500 bulb-2"
                />
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
            <p className="mx-auto">Nhập mật khẩu mới</p>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <Input
                  type="password"
                  placeholder="Mật khẩu"
                  className="border-2"
                  value={password}
                  require={true}
                  onChange={(e) => handleChangeInput(e, "password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  className="border-2"
                  value={passwordConfirm}
                  require={true}
                  onChange={(e) => handleChangeInput(e, "passwordConfirm")}
                />
                {errors.passwordConfirm && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.passwordConfirm}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <Button
                  className="bg-red-600 hover:bg-red-500"
                  isLoading={isLoading}
                >
                  Xác nhận
                </Button>
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center block">
                  {error}
                </p>
              )}
            </form>
            <div className="mx-auto">
              <span className="text-sm text-neutral-400">Quay về</span>
              <Link href="/login">
                <Button variant="link" className="text-sm px-2 text-red-600">
                  Đăng nhập
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
