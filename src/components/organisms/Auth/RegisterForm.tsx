import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { FaTree, FaLightbulb } from "react-icons/fa6";
import { PiLightbulbFilamentFill } from "react-icons/pi";
const RegisterForm: React.FC = () => {
  return (
    <div className="bg-blue-100 py-8 h-[calc(100vh-64px)]">
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
            <Input placeholder="Số điện thoại" className="border-2 " />
            <Input
              type="password"
              placeholder="Mật khẩu"
              className="border-2"
            />
            <Input
              type="password"
              placeholder="Nhập lại mật khẩu"
              className="border-2"
            />
            <div className="flex flex-col">
              <Button className="bg-red-600 hover:bg-red-500">Đăng Ký</Button>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
