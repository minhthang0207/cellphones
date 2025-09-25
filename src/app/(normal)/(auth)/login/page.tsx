import LoginForm from "@/components/organisms/Auth/LoginForm";
import { Suspense } from "react";
import Loading from "@/components/organisms/Loading";

export const metadata = {
  title: "Đăng nhập",
};

const LoginPage = () => {
  return (
    <Suspense fallback={<Loading fullWeb={true} hasOverLay={true} /> }>
      <LoginForm />;
    </Suspense>
  )
};

export default LoginPage;
