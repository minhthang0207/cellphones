import ListProductCategoryForm from "@/components/organisms/ListProductCategory/ListProductCategoryForm";

// Component hiển thị sản phẩm
const ListProductCategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  // return <SingleProductForm product={product} />;
  return <ListProductCategoryForm slug={slug} />;
};

export default ListProductCategoryPage;
