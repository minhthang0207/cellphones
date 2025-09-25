import Image from "next/image";
import { FaFacebook, FaYoutube, FaTiktok, FaInstagram } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
const Footer: React.FC = () => {
  return (
    <div className="border border-t bg-white hidden md:block">
      <div className="max-w-[1280px] p-4 grid md:grid-cols-2 md:gap-y-8 lg:grid-cols-4 gap-4 mx-auto py-4 ">
        {/* col 1 */}
        <div>
          <p className="font-semibold text-sm mb-2">Tổng đài hỗ trợ</p>
          <div className="flex flex-col gap-2">
            <p className="text-sm">
              Gọi mua hàng <span className="font-semibold ">1800.2097</span>{" "}
              (7h30 - 22h00)
            </p>
            <p className="text-sm">
              Gọi khiếu nại <span className="font-semibold ">1800.2063</span>{" "}
              (8h00 - 21h30)
            </p>
            <p className="text-sm">
              Gọi bảo hành <span className="font-semibold ">1800.2064</span>{" "}
              (8h00 - 21h00)
            </p>
          </div>
        </div>
        {/* col 2 */}
        <div>
          <p className="font-semibold text-sm mb-2">Về công ty</p>
          <div className="flex flex-col gap-2">
            <p className="text-sm">Giới thiệu công ty</p>
            <p className="text-sm">Tuyển dụng</p>
            <p className="text-sm">Tìm siêu thị (2.965 shop)</p>
          </div>
        </div>
        {/* col 3 */}
        <div>
          <p className="font-semibold text-sm mb-2">Thông tin khác</p>
          <div className="flex flex-col gap-2">
            <p className="text-sm">Tích điểm Quà tặng VIP</p>
            <p className="text-sm">Lịch sử mua hàng</p>
            <p className="text-sm">DV vệ sinh máy lạnh</p>
            <p className="text-sm">Tìm hiểu về mua trả chậm</p>
            <p className="text-sm">Chính sách bảo hành</p>
          </div>
        </div>
        {/* col 4 */}
        <div>
          <p className="font-semibold text-sm mb-2">Kết nối với CellphoneS</p>
          <div className="mb-2 flex gap-4">
            <FaFacebook size={26} className="text-blue-600" />
            <FaYoutube size={26} className="text-red-600" />
            <FaTiktok size={26} />
            <FaInstagram size={26} className="text-pink-600" />
            <SiZalo size={26} className="text-blue-600" />
          </div>
          <p className="font-semibold text-sm mb-2">Website thành viên</p>
          <div className="flex flex-col gap-2">
            <Image src="/dienthoaivui.png" alt="logo" width={149} height={30} />
            <Image src="/cares.png" alt="logo" width={80} height={30} />
            <Image
              src="/cellphoneswork.png"
              alt="logo"
              width={73}
              height={30}
            />
            <Image
              src="/cellphoneS-forum.png"
              alt="logo"
              width={103}
              height={30}
            />
          </div>
        </div>
      </div>
      <div className="p-4">
        {/* bg-neutral-100 */}
        <div className="max-w-[1280px] mx-auto">
          <p className="text-xs text-neutral-500">
            Công ty TNHH Thương Mại và Dịch Vụ Kỹ Thuật DIỆU PHÚC - GPĐKKD:
            0316172372 cấp tại Sở KH & ĐT TP. HCM. Địa chỉ văn phòng: 350-352 Võ
            Văn Kiệt, Phường Cô Giang, Quận 1, Thành phố Hồ Chí Minh, Việt Nam.
            Điện thoại: 028.7108.9666
          </p>
          <div className="flex gap-4 mt-4 justify-center items-center">
            <Image src="/policy1.png" alt="policy" width={80} height={30} />
            <Image src="/policy2.png" alt="policy" width={120} height={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
