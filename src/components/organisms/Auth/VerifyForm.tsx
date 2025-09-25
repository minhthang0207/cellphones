"use client";

import { Button } from "@/components/ui/button";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import { FaTree, FaLightbulb } from "react-icons/fa6";
import { PiLightbulbFilamentFill } from "react-icons/pi";
import { useRouter, useSearchParams } from "next/navigation";
import { generateOTP, getUser, verifyOTP } from "@/lib";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user";

const VerifyForm: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const addUser = useUserStore((state) => state.addUser);

  const handleOtpChange = (newOtp: string) => {
    setCode(newOtp);
  };

  const handleReSendOTP = () => {
    if (email) {
      setError("");
      setSuccess("");
      triggerSendOTP(email);
    }
  };

  const validate = () => {
    let valid = true;
    if (!code) {
      setError("Vui lòng nhập mã code OTP");
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

    if (email) {
      const result = await verifyOTP(email, code);
      if (result.success) {
        const resultUser = await getUser();
        if (resultUser.success && resultUser.data.user) {
          addUser(resultUser.data.user);
        }
        return router.push("/");
      } else {
        setError(result.message);
      }
    }
    setIsLoading(false);
  };

  const triggerSendOTP = async (email: string) => {
    const result = await generateOTP(email);
    if (result.success) {
      setSuccess(result.message);
    } else {
      setError(result.message);
    }
  };

  useEffect(() => {
    if (email) {
      triggerSendOTP(email);
    }
  }, [email]);
  return (
    <div className="bg-blue-100 py-8 h-[calc(100vh-64px)]">
      <div className="mx-auto w-[90%] sm:w-[60%] lg:w-[40%]">
        <div className="w-full">
          <div className="border rounded-lg flex flex-col gap-4 w-full h-fit p-4 bg-white">
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
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="mx-auto">
                <InputOTP
                  maxLength={4}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  onChange={handleOtpChange}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className=" border-neutral-500 " />
                    <InputOTPSlot index={1} className=" border-neutral-500" />
                    <InputOTPSlot index={2} className=" border-neutral-500" />
                    <InputOTPSlot index={3} className=" border-neutral-500" />
                  </InputOTPGroup>
                </InputOTP>
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
              {success && (
                <p className="text-green-500 text-sm text-center block">
                  {success}
                </p>
              )}
            </form>
            <div className="mx-auto">
              <span className="text-sm text-neutral-400">
                Chưa nhận được mã?
              </span>

              <Button
                variant="link"
                className="text-sm px-2 text-red-600"
                onClick={handleReSendOTP}
              >
                Gửi lại OTP
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyForm;
