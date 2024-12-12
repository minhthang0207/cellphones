import ResetPasswordForm from "@/components/organisms/Auth/ResetPasswordForm";

const ResetPassword = async ({
  params,
}: {
  params: Promise<{ token: string }>;
}) => {
  const { token } = await params;
  return <ResetPasswordForm token={token} />;
};

export default ResetPassword;
