import Footer from "../Footer";
import Header from "../Header";

const NormalLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen overflow-y-scroll overflow-x-hidden ">
      <div>
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default NormalLayoutWrapper;
