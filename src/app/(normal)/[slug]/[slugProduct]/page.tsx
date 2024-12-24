import SingleProductForm from "@/components/organisms/ListProductCategory/DetailSingleProduct/SingleProductForm";
import { getProductBySlug } from "@/lib";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getProduct(slugProduct: string) {}

// Component hiển thị sản phẩm
const SingleProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string; slugProduct: string }>;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { slug, slugProduct } = await params;

  // Lấy dữ liệu sản phẩm từ hàm getProduct
  const result = await getProductBySlug(slugProduct);
  console.log(result);

  const colors = [
    ...new Set(
      result.data.variants.map((variant: Variant) => variant.Color.id)
    ),
  ].map(
    (id) =>
      result.data.variants.find((variant: Variant) => variant.Color.id === id)
        ?.Color
  );

  const rams = [
    ...new Set(result.data.variants.map((variant: Variant) => variant.Ram.id)),
  ].map(
    (id) =>
      result.data.variants.find((variant: Variant) => variant.Ram.id === id)
        ?.Ram
  );

  const roms = [
    ...new Set(result.data.variants.map((variant: Variant) => variant.Rom.id)),
  ].map(
    (id) =>
      result.data.variants.find((variant: Variant) => variant.Rom.id === id)
        ?.Rom
  );

  // Kiểm tra nếu sản phẩm không tồn tại hoặc slug không khớp
  // if (!product || product.category_slug !== slug) {
  //   redirect("/error"); // Redirect nếu không tìm thấy sản phẩm hoặc slug không khớp
  // }

  return (
    <SingleProductForm
      product={result.data.product}
      variants={result.data.variants}
      productImages={result.data.productImages}
      listColor={colors}
      listRam={rams}
      listRom={roms}
    />
  );
  return <div>12</div>;
};

export default SingleProductPage;
