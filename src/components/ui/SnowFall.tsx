"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaSnowflake } from "react-icons/fa"; // Sử dụng react-icons

interface Snow {
  id: number;
  left: number;
  size: number;
  duration: number;
}
const Snowfall: React.FC = () => {
  const [snowflakes, setSnowflakes] = useState<Snow[]>([]);

  useEffect(() => {
    // Tạo tuyết ngẫu nhiên
    const createSnowflake = () => {
      if (snowflakes.length < 50) {
        // Giới hạn số lượng bông tuyết tối đa
        setSnowflakes((prevSnowflakes) => [
          ...prevSnowflakes,
          {
            id: Math.random(),
            left: Math.random() * window.innerWidth,
            size: Math.random() * 10 + 10, // Kích thước ngẫu nhiên
            duration: Math.random() * 5 + 2, // Thời gian rơi ngẫu nhiên
          },
        ]);
      }
    };

    // Thêm tuyết liên tục, nhưng giảm tần suất tạo bông tuyết (2 giây thay vì 1 giây)
    const interval = setInterval(createSnowflake, 2000); // 2000ms = 2 giây

    // Dọn dẹp khi component bị unmount
    return () => {
      clearInterval(interval);
    };
  }, [snowflakes]); // Đảm bảo chỉ thay đổi khi mảng snowflakes thay đổi

  // CSS style cho bông tuyết
  const snowflakeStyle = (snowflake: Snow): React.CSSProperties => ({
    position: "fixed",
    top: "-10px",
    left: `${snowflake.left}px`,
    fontSize: `${snowflake.size}px`,
    animation: `fall ${snowflake.duration}s linear infinite`,
    color: "white",
    opacity: 0.7,
    zIndex: 9999,
  });

  return (
    <>
      {snowflakes.map((snowflake) => (
        <div key={snowflake.id} style={snowflakeStyle(snowflake)}>
          <FaSnowflake />
        </div>
      ))}

      <Image
        width={120}
        height={120}
        src="/bottom-left-page.png" // Đảm bảo bạn đã có hình ảnh cây thông trong thư mục public
        alt="Christmas snow man"
        loading="lazy"
        style={{
          width: "auto",
          height: "auto",
          position: "fixed",
          bottom: "-1%",
          left: "-1%",
          zIndex: 9998,
          pointerEvents: "none",
        }}
        className="z-50 hidden md:block"
        priority={false}

      />

      <Image
        width={120}
        height={120}
        src="/top-right-page.png"
        alt="Christmas snow man"
        style={{
          width: "auto",
          height: "auto",
          position: "fixed",
          top: "64px",
          right: "0%",
          pointerEvents: "none",
        }}
        className="z-50 hidden md:block"
        priority={false}

      />

        
      {/* <div className="fixed top-[-1%] left-[14%] flex-row gap-16 z-50 hidden md:flex">
        <Image
          width={120}
          height={120}
          src="/top-left-page.png"
          alt="Christmas snow man"
          // style={{
          //   position: "fixed",
          //   top: "0px",
          //   left: "300px",
          //   pointerEvents: "none",
          // }}
          className="rotate-180 z-50 block"
          priority={false}
        />

        <Image
          width={120}
          height={120}
          src="/top-left-page.png"
          alt="Christmas snow man"
          // style={{
          //   position: "fixed",
          //   top: "0px",
          //   left: "300px",
          //   pointerEvents: "none",
          // }}
          className="rotate-180 z-50 "
          priority={false}
        />

      </div> */}

      <style>
        {`
          @keyframes fall {
            to {
              transform: translateY(100vh) rotate(360deg);
            }
          }
        `}
      </style>
    </>
  );
};

export default Snowfall;
