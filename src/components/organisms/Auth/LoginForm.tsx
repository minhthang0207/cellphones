"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUser, login } from "@/lib";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaTree, FaLightbulb } from "react-icons/fa6";
import { PiLightbulbFilamentFill } from "react-icons/pi";
import { useUserStore } from "@/store/user";

const LoginForm = () => {
  const addUser = useUserStore((state) => state.addUser);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useUserStore((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const validate = () => {
    let valid = true;
    const newError = {
      email: "",
      password: "",
    };
    if (!email) {
      newError.email = "Bạn cần nhập email";
      valid = false;
    }
    if (!password) {
      newError.password = "Bạn cần nhập mật khẩu";
    }

    setErrors(newError);
    return valid;
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value.length > 0) {
      setErrors((prev) => ({
        ...prev,
        email: "",
        password: "",
      }));
      setError("");
    }
  };
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value.length > 0) {
      setErrors((prev) => ({
        ...prev,
        email: "",
        password: "",
      }));
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    const resultUser = await getUser();
    if (resultUser.success && resultUser.data.user) {
      addUser(resultUser.data.user);
    }

    if (result.message === "Tài khoản này chưa được xác thực") {
      return router.push(`verify?email=${encodeURIComponent(email)}`);
    }
    if (result.success) {
      router.push("/");
    } else {
      setError(result.message);
    }
  };

  const handleForgotPassword = () => {};

  return (
    <div className="bg-blue-100 py-8 h-[calc(100vh-64px)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="  flex items-center justify-center">
          <div className="border rounded-lg flex flex-col gap-4 w-1/2 h-fit p-4 bg-white">
            <div className="flex justify-between items-center">
              <p className="mb-2 text-2xl">Đăng nhập</p>
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
                priority={false}
              />
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <Input
                  placeholder="Email"
                  className="border-2 "
                  type="email"
                  value={email}
                  onChange={(e) => handleChangeEmail(e)}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Mật khẩu"
                  className="border-2"
                  value={password}
                  onChange={(e) => handleChangePassword(e)}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </div>

              <div className="flex flex-col">
                <Button
                  className="bg-red-600 hover:bg-red-500"
                  isLoading={isLoading}
                >
                  Đăng nhập
                </Button>
                <Link href="/forgot-password">
                  <Button
                    variant="link"
                    className="text-xs p-0 justify-start"
                    onClick={handleForgotPassword}
                  >
                    Quên mật khẩu
                  </Button>
                </Link>
                <div>
                  {error && (
                    <p className="text-red-500 text-sm text-center ">{error}</p>
                  )}
                </div>
              </div>
              <div className="mx-auto">
                <span className="text-sm text-neutral-400">
                  Bạn mới đến CellphoneS?
                </span>
                <Link href="/register">
                  <Button variant="link" className="text-sm px-2 text-red-600">
                    Đăng ký
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

export default LoginForm;
