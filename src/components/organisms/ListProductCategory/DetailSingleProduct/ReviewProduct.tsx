import { Textarea } from "@/components/ui/textarea";
import { useUserStore } from "@/store/user";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  createReview,
  deleteReview,
  getAllReviewByProductID,
} from "@/libStatistic";
import { FaStar } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import CustomAlertDialog from "@/components/ui/alert-dialog-custom";
import Loading from "../../Loading";
import { toast } from "sonner";

interface ReviewProductProps {
  productId: string;
}

interface Review {
  id: string;
  rating: number;
  review: string;
  user_id: string;
  product_id: string;
  createdAt: string;
  updatedAt: string;
  User: User;
}

interface User {
  name: string;
  avatar: string;
  phone: string;
  email: string;
}

const ReviewProduct: React.FC<ReviewProductProps> = ({ productId }) => {
  const user = useUserStore((state) => state.user);
  const [reviewUser, setReviewUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [listReview, setListReview] = useState<Review[]>([]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isShowAlert, setIsShowAlert] = useState(false);
  const [selectedIdDelete, setSelectedIdDelete] = useState("");

  const [rating, setRating] = useState(0);
  const handleChangeReview = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewUser(e.target.value);
  };
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString); // Tạo đối tượng Date từ chuỗi

    // Lấy ngày, tháng, năm
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    // Lấy giờ, phút, giây
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    // Trả về chuỗi định dạng "dd/mm/yyyy hh:mm:ss"
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const handlePostComment = async () => {
    if (!user.id) {
      toast.error("Vui lòng đăng nhập để bình luận");
      return;
    }

    if (!reviewUser) {
      toast.error("Vui lòng nhập bình luận");
      return;
    }

    if (!rating) {
      toast.error("Vui lòng đánh giá số sao");
      return;
    }
    setIsLoading(true);
    const data = {
      review: reviewUser,
      rating,
      product_id: productId,
      user_id: user.id,
    };
    const result = await createReview(data);
    if (result.success) {
      const result1 = await getAllReviewByProductID(productId);
      if (result1.success) {
        setListReview(result1.data.reviews);
      }
    }
    setRating(0);
    setReviewUser("");
    setIsLoading(false);
  };

  const handOpenDialogDelete = (itemId: string) => {
    setIsShowAlert(true);
    setSelectedIdDelete(itemId);
  };

  const handleCancel = () => {
    setIsShowAlert(false); // Đóng dialog
  };

  const handleDelete = async () => {
    setIsLoading(true);

    const result = await deleteReview(selectedIdDelete);
    if (result.success) {
      const result1 = await getAllReviewByProductID(productId);
      if (result1.success) {
        setListReview(result1.data.reviews);
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await getAllReviewByProductID(productId);
      if (result.success) {
        setListReview(result.data.reviews);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [productId]);

  return (
    <div>
      <h6 className="font-semibold">Bình luận</h6>
      <div className="mt-4 ">
        <div className="flex gap-4 items-center mb-4">
          {!user.id ? (
            <Avatar>
              <AvatarImage
                src="https://github.com/shadcn.png"
                className="object-cover"
              />
            </Avatar>
          ) : (
            <Avatar>
              <AvatarImage src={user.avatar} className="object-cover" />
            </Avatar>
          )}
          <div className="flex flex-col gap-1">
            <p>{user.name}</p>
            <p className="text-sm text-neutral-500 mb-1">{user.email}</p>
            <div className="flex gap-2 ">
              {Array.from({ length: 5 }, (_, i) => {
                return (
                  <div
                    key={i}
                    onMouseEnter={() => setHoverIndex(i)} // Cập nhật trạng thái khi hover
                    onMouseLeave={() => {
                      setHoverIndex(null);
                    }} // Xóa trạng thái khi không hover
                    onClick={() => setRating(i + 1)}
                  >
                    <FaStar
                      size={14}
                      className={` ${
                        i <= (hoverIndex ?? -1)
                          ? "text-yellow-500"
                          : "text-neutral-400"
                      } ${i + 1 <= rating && "text-yellow-500"}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <Textarea
          value={reviewUser}
          onChange={handleChangeReview}
          className="min-h-[124px]"
          placeholder="Bình luần của bạn"
        />
      </div>
      <div className="flex justify-end gap-4 my-4">
        <button
          className="text-neutral-800 px-2 py-1 hover:text-red-500 transition duration-300"
          onClick={() => handlePostComment()}
        >
          Bình luận
        </button>
        <button
          className="text-neutral-600 px-2 py-1 hover:text-red-500 transition duration-300"
          onClick={() => {
            setRating(0);
            setReviewUser("");
          }}
        >
          Hủy bỏ
        </button>
      </div>

      <h6 className="font-semibold mb-6">Các bình luận trước</h6>

      {isLoading ? (
        <div className="min-h-[300px] w-full justify-center items-center">
          <Loading fullWeb={false} hasOverLay={false} />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {listReview &&
            listReview.map((item, index) => {
              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col pb-4 ${
                    index < listReview.length - 1 && "border-b-2"
                  }`}
                >
                  <div className="flex gap-4 items-center mb-4">
                    <Avatar>
                      <AvatarImage
                        src={item.User.avatar}
                        className="object-cover"
                      />
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      <p>{item.User.name}</p>
                      <p className="text-sm text-neutral-500 mb-1">
                        {item.User.email}
                      </p>
                      <div className="flex gap-2 items-center ">
                        {Array.from({ length: item.rating }, (_, i) => {
                          return (
                            <div key={i}>
                              <FaStar size={14} className="text-yellow-500" />
                            </div>
                          );
                        })}
                        <p className="ml-2 text-xs text-neutral-500 ">
                          {formatDateTime(item.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p>{item.review}</p>

                  {item.user_id === user.id && (
                    <button
                      className="absolute right-2 top-2 "
                      onClick={() => handOpenDialogDelete(item.id)}
                    >
                      <FaTimes
                        size={14}
                        className="text-neutral-400 hover:text-neutral-500 transition duration-300"
                      />
                    </button>
                  )}
                  {isShowAlert && (
                    <CustomAlertDialog
                      title="Bạn chắc chắn muốn xóa?"
                      description="Thao tác này sẽ không thể hoàn tác."
                      onConfirm={() => handleDelete()}
                      onCancel={handleCancel}
                      isOpen={isShowAlert}
                      onClose={() => setIsShowAlert(false)}
                    />
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
export default ReviewProduct;
