import Link from "next/link";
import { TbBrandApple } from "react-icons/tb";
import { FaRulerHorizontal } from "react-icons/fa";
import { FaRuler } from "react-icons/fa6";
import { IoIosColorPalette } from "react-icons/io";

const AttributeForm: React.FC = () => {
  return (
    <div className="p-4 grid grid-cols-2 gap-4 ">
      {listAttribute.map((item) => {
        return (
          <Link
            key={item.label}
            href={item.link}
            className="flex gap-4 items-center px-4 py-12 bg-white rounded-md shadow-sm hover:shadow-lg transition duration-300"
          >
            {item.icon}
            <span className="uppercase text-lg font-bold">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default AttributeForm;

const listAttribute = [
  {
    label: "Thương hiệu",
    link: "/dashboard-admin/thuoc-tinh/thuong-hieu",
    icon: <TbBrandApple size={60} />,
  },
  {
    label: "Ram",
    link: "/dashboard-admin/thuoc-tinh/ram",
    icon: <FaRulerHorizontal size={60} className="text-green-300" />,
  },
  {
    label: "Rom",
    link: "/dashboard-admin/thuoc-tinh/rom",
    icon: <FaRuler size={60} />,
  },
  {
    label: "Màu sắc",
    link: "/dashboard-admin/thuoc-tinh/mau-sac",
    icon: <IoIosColorPalette size={60} className="text-purple-300" />,
  },
];
