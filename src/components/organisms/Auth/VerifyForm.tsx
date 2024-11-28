"use client";

import { Button } from "@/components/ui/button";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import Link from "next/link";
import { FaTree, FaLightbulb } from "react-icons/fa6";
import { PiLightbulbFilamentFill } from "react-icons/pi";

const VerifyForm: React.FC = () => {
  return (
    <div className="bg-blue-100 py-8 h-[calc(100vh-64px)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="  flex items-center justify-center">
          <div className="border rounded-lg flex flex-col gap-4 w-[40%] h-fit p-4 bg-white">
            <div className="flex justify-between items-center">
              <p className="mb-2 text-2xl">Nhập mã OTP</p>
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
            <p className="mx-auto">Nhập 4 chữ số từ email gửi về</p>
            <div className="mx-auto">
              <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
                <InputOTPGroup>
                  <InputOTPSlot
                    index={0}
                    className="w-[80px] h-[44px] border-neutral-500 "
                  />
                  <InputOTPSlot
                    index={1}
                    className="w-[80px] h-[44px] border-neutral-500"
                  />
                  <InputOTPSlot
                    index={2}
                    className="w-[80px] h-[44px] border-neutral-500"
                  />
                  <InputOTPSlot
                    index={3}
                    className="w-[80px] h-[44px] border-neutral-500"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="flex flex-col">
              <Button className="bg-red-600 hover:bg-red-500">Xác nhận</Button>
            </div>
            <div className="mx-auto">
              <span className="text-sm text-neutral-400">
                Chưa nhận được mã?
              </span>
              <Link href="/register">
                <Button variant="link" className="text-sm px-2 text-red-600">
                  Gửi lại OTP
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyForm;
