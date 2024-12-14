import BrandForm from "@/components/organisms/Admin/Dashboard/Attribute/Brand/BrandForm";
import ColorForm from "@/components/organisms/Admin/Dashboard/Attribute/Color/ColorForm";
import RamForm from "@/components/organisms/Admin/Dashboard/Attribute/Ram/RamForm";
import RomForm from "@/components/organisms/Admin/Dashboard/Attribute/Rom/RomForm";

const SingleAttribute = async ({
  params,
}: {
  params: Promise<{ slug: string; slugProduct: string }>;
}) => {
  const { slug } = await params;

  const renderForm = () => {
    switch (slug) {
      case "thuong-hieu":
        return <BrandForm />;
      case "ram":
        return <RamForm />;
      case "rom":
        return <RomForm />;
      case "mau-sac":
        return <ColorForm />;
      default:
        return <div>Trang không tìm thấy</div>;
    }
  };

  return renderForm();
};

export default SingleAttribute;
