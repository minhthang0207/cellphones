import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const ErorPage = () => {
  return (
    <div className="h-screen w-screen flex justify-center overflow-hidden">
      <div className=" w-1/2 h-1/2  mt-12">
        <div className="relative w-full h-full">
          <Image
            src="/errorpage_img.jpg"
            alt="error image"
            fill
            className="object-contain"
          />
        </div>

        <p className="text-center    text-base font-semibold">
          Bạn đã nhập đúng đường dẫn chứ
        </p>
        <p className="text-center    text-xs">
          Đường dẫn bạn vừa nhập không còn tồn tại
        </p>
        <p className="text-center    text-xs">
          Vui lòng liên hệ đến bộ phận hỗ trợ
        </p>

        <Link href="/" className="flex justify-center w-full mt-4 ">
          <Button className="text-white bg-red-600 hover:bg-red-500">
            Xem thêm sản phẩm
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ErorPage;
