import CartPage from "@/components/organisms/Cart/CartPage";
import { Suspense } from "react";
const Dashboard: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CartPage />
    </Suspense>
  )
}

export default Dashboard;
