"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/lib";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaTree, FaLightbulb } from "react-icons/fa6";
import { PiLightbulbFilamentFill } from "react-icons/pi";

const ForgotPasswordForm: React.FC = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value.length > 0) {
      setError("");
    }
  };

  const validate = () => {
    let valid = true;

    if (!email) {
      setError("Bạn cần nhập họ tên");
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
    const result = await forgotPassword(email);

    if (!result.success) {
      setError(result.message);
    } else {
      setSuccess(result.message);
    }
    setIsLoading(false);
  };
  return (
    <div className="bg-blue-100 py-8 h-[calc(100vh-64px)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="  flex items-center justify-center">
          <div className="border rounded-lg flex flex-col gap-4 w-1/2 h-fit p-4 bg-white">
            <div className="flex justify-between items-center">
              <p className="mb-2 text-2xl">Quên mật khẩu</p>
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
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Email"
                className="border-2"
                value={email}
                onChange={(e) => handleChangeInput(e)}
              />

              <div className="flex flex-col">
                <Button
                  className="bg-red-600 hover:bg-red-500"
                  isLoading={isLoading}
                >
                  Tiếp tục
                </Button>
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center block">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-green-500 text-sm text-center block">
                  {success}
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
export default ForgotPasswordForm;
