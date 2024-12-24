import Image from "next/image";
import { ImSpinner8 } from "react-icons/im";

interface LoadingProps {
  hasOverLay?: boolean;
  fullWeb?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  hasOverLay = false,
  fullWeb = true,
}) => {
  return (
    <>
      {fullWeb ? (
        <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center">
          <div className="w-[50px] h-[50px] flex items-center justify-center border-2 border-primary-main rounded-full bg-white z-20">
            <Image
              alt="logo"
              src="/logo_small.jpg"
              width={40}
              height={40}
              className="border rounded-full animate-spin"
            />
          </div>
          {hasOverLay && (
            <div className="fixed top-0 left-0 w-full h-screen bg-neutral-200 opacity-40 "></div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ImSpinner8 className="animate-spin text-red-500" size={30} />
        </div>
      )}
    </>
  );
};

export default Loading;
