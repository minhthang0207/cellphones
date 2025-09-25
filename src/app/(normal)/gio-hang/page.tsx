import CartPage from "@/components/organisms/Cart/CartPage";
import Loading from "@/components/organisms/Loading";
import { Suspense } from "react";
const Dashboard: React.FC = () => {
  return (
    <Suspense fallback={<Loading fullWeb={true} hasOverLay={true} /> }>
      <CartPage />
    </Suspense>
  )
}

export default Dashboard;
