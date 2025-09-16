"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const CounterCard = ({
  label,
  finalValue,
  image_url,
  numberLarge = false,
}: {
  label: string;
  finalValue: number;
  image_url: string;
  numberLarge?: boolean;
}) => {
  const [count, setCount] = useState(0); // Khởi tạo số ban đầu là 0
  const duration = 1000; // Thời gian chạy số (1 giây)

  useEffect(() => {
    let startTime: number;
    let animationFrameId: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * finalValue)); // Tính giá trị số
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount); // Cập nhật số liên tục
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrameId); // Dọn dẹp khi component unmount
  }, [finalValue]);

  return (
    <div className="flex gap-4 justify-between p-4 shadow-md bg-white rounded-lg w-full hover:shadow-lg transition duration-300">
      <div className="flex-col gap-4">
        <p className="text-neutral-800 font-semibold text-2xl">
          {numberLarge ? `${Number(count).toLocaleString("vi-en")}đ` : count}
        </p>
        <p className="text-neutral-600 text-base">{label}</p>
      </div>
      <Image
        src={image_url}
        width={40}
        height={40}
        alt="logo"
        className="object-cover"
      />
    </div>
  );
};

export default CounterCard;
