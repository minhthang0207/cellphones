import ProductForm from "@/components/organisms/Admin/Dashboard/ManageProduct/Form/ProductForm";
import React, { Suspense } from "react";
const ProductFormPage: React.FC = () => {
  return (
    <Suspense>
      <ProductForm />
    </Suspense>
  );
};
export default ProductFormPage;
