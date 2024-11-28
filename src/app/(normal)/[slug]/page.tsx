import ListProductCategoryForm from "@/components/organisms/ListProductCategory/ListProductCategoryForm";

interface ListProductCategoryPageProps {
  params: { slug: string };
}
const ListProductCategoryPage: React.FC<ListProductCategoryPageProps> = () => {
  return <ListProductCategoryForm />;
};

export default ListProductCategoryPage;
