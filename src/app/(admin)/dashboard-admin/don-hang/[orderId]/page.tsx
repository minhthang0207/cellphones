import OrderDetailForm from "@/components/organisms/Admin/Dashboard/ManageOrder/OrderDetailForm";

// Component hiển thị sản phẩm
const OrderDetailPage = async ({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) => {
  const { orderId } = await params;

  return <OrderDetailForm slug={orderId} />;
};

export default OrderDetailPage;
