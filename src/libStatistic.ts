import Cookies from "js-cookie";

// getStatisticChart
export async function getStatisticChart(data: {
  year: number;
  period: string;
  months: number;
}): Promise<{
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  message?: string;
}> {
  try {
    const token = Cookies.get("session");

    if (!token) {
      return { success: false, message: "Không tìm thấy mã xác thực" };
    }

    // Gửi yêu cầu đến API để lấy thông tin người dùng
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/statistics/${
        data.year
      }?period=${data.period}&months=${data.months ? data.months : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Đặt trong headers
        },
      }
    );

    const result = await response.json();

    // Kiểm tra nếu phản hồi thành công
    if (response.ok) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.message || "Có lỗi xảy ra",
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại sau!" };
  }
}

// getStatisticSummary
export async function getStatisticSummary(): Promise<{
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  message?: string;
}> {
  try {
    const token = Cookies.get("session");

    if (!token) {
      return { success: false, message: "Không tìm thấy mã xác thực" };
    }

    // Gửi yêu cầu đến API để lấy thông tin người dùng
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/statistics/summary`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Đặt trong headers
        },
      }
    );

    const result = await response.json();

    // Kiểm tra nếu phản hồi thành công
    if (response.ok) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.message || "Có lỗi xảy ra",
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại sau!" };
  }
}

// GET ALL WISHLIST ITEM
export async function getAllWishListItem(userId: string): Promise<{
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  message?: string;
}> {
  try {
    const token = Cookies.get("session");

    if (!token) {
      return { success: false, message: "Không tìm thấy mã xác thực" };
    }

    // Gửi yêu cầu đến API để lấy thông tin người dùng
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/wishlists`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Đặt trong headers
        },
      }
    );

    const result = await response.json();

    // Kiểm tra nếu phản hồi thành công
    if (response.ok) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.message || "Có lỗi xảy ra",
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại sau!" };
  }
}

// CREATE WISHLIST ITEM
export async function createWishListItem(
  userId: string,
  productId: string
): Promise<{
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  message?: string;
}> {
  try {
    const token = Cookies.get("session");

    if (!token) {
      return { success: false, message: "Không tìm thấy mã xác thực" };
    }

    // Gửi yêu cầu đến API để lấy thông tin người dùng
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wishlists`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Đặt trong headers
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
        }),
      }
    );

    const result = await response.json();

    // Kiểm tra nếu phản hồi thành công
    if (response.ok) {
      return {
        success: true,
        data: result.data,
        message: "Tạo mới thành công",
      };
    } else {
      return {
        success: false,
        message: result.message || "Có lỗi xảy ra",
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại sau!" };
  }
}

// DELETE WISHLIST ITEM
export async function deleteWishListItem(itemId: string): Promise<{
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  message?: string;
}> {
  try {
    const token = Cookies.get("session");

    if (!token) {
      return { success: false, message: "Không tìm thấy mã xác thực" };
    }

    // Gửi yêu cầu đến API để lấy thông tin người dùng
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wishlists/${itemId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Đặt trong headers
        },
      }
    );

    const result = await response.json();

    // Kiểm tra nếu phản hồi thành công
    if (response.ok) {
      return {
        success: true,
        data: result.data,
        message: "Xóa thành công",
      };
    } else {
      return {
        success: false,
        message: result.message || "Có lỗi xảy ra",
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại sau!" };
  }
}

// GET PRODUCT BY NAME (SEARCH LIMIT 5 ITEM)
export async function getProductByName(name: string): Promise<{
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  message?: string;
}> {
  try {
    // Gửi yêu cầu đến API để lấy thông tin người dùng
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?name=${name}&limit=5`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    // Kiểm tra nếu phản hồi thành công
    if (response.ok) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.message || "Có lỗi xảy ra",
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại sau!" };
  }
}

// GET ALL REVIEW
export async function getAllReviewByProductID(productId: string): Promise<{
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  message?: string;
}> {
  try {
    const token = Cookies.get("session");

    // Gửi yêu cầu đến API để lấy thông tin người dùng
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}/reviews`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Đặt trong headers
        },
      }
    );

    const result = await response.json();

    // Kiểm tra nếu phản hồi thành công
    if (response.ok) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.message || "Có lỗi xảy ra",
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại sau!" };
  }
}
// CREATE REVIEW
export async function createReview(data: {
  review: string;
  rating: number;
  product_id: string;
  user_id: string;
}): Promise<{
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  message?: string;
}> {
  try {
    const token = Cookies.get("session");

    if (!token) {
      return { success: false, message: "Không tìm thấy mã xác thực" };
    }

    // Gửi yêu cầu đến API để lấy thông tin người dùng
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Đặt trong headers
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    // Kiểm tra nếu phản hồi thành công
    if (response.ok) {
      return {
        success: true,
        data: result.data,
        message: "Tạo mới thành công",
      };
    } else {
      return {
        success: false,
        message: result.message || "Có lỗi xảy ra",
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại sau!" };
  }
}

// DELETE REVIEW
export async function deleteReview(itemId: string): Promise<{
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  message?: string;
}> {
  try {
    const token = Cookies.get("session");

    if (!token) {
      return { success: false, message: "Không tìm thấy mã xác thực" };
    }

    // Gửi yêu cầu đến API để lấy thông tin người dùng
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${itemId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Đặt trong headers
        },
      }
    );

    const result = await response.json();

    // Kiểm tra nếu phản hồi thành công
    if (response.ok) {
      return {
        success: true,
        data: result.data,
        message: "Xóa thành công",
      };
    } else {
      return {
        success: false,
        message: result.message || "Có lỗi xảy ra",
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại sau!" };
  }
}

// GET ALL USER ADMIN
export async function getAllUserAdmin(): Promise<{
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  message?: string;
}> {
  try {
    const token = Cookies.get("session");

    if (!token) {
      return { success: false, message: "Không tìm thấy mã xác thực" };
    }

    // Gửi yêu cầu đến API để lấy thông tin người dùng
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Đặt trong headers
        },
      }
    );

    const result = await response.json();

    // Kiểm tra nếu phản hồi thành công
    if (response.ok) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.message || "Có lỗi xảy ra",
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại sau!" };
  }
}

// UPDATE USER ADMIN
export async function updateUserAdmin(
  data: {
    password?: string;
    passowrdConfirm?: string;
    isVerify?: boolean;
    role?: string;
  },
  id: string
): Promise<{
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  message?: string;
}> {
  try {
    const token = Cookies.get("session");

    if (!token) {
      return { success: false, message: "Không tìm thấy mã xác thực" };
    }

    // Gửi yêu cầu đến API để lấy thông tin người dùng
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Đặt trong headers
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    // Kiểm tra nếu phản hồi thành công
    if (response.ok) {
      return {
        success: true,
        data: result.data,
        message: "Cập nhật thành công",
      };
    } else {
      return {
        success: false,
        message: result.message || "Có lỗi xảy ra",
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại sau!" };
  }
}

// DELETE USER ADMIN
export async function deleteUserAdmin(id: string): Promise<{
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  message?: string;
}> {
  try {
    const token = Cookies.get("session");

    if (!token) {
      return { success: false, message: "Không tìm thấy mã xác thực" };
    }

    // Gửi yêu cầu đến API để lấy thông tin người dùng
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Đặt trong headers
        },
      }
    );

    const result = await response.json();

    // Kiểm tra nếu phản hồi thành công
    if (response.ok) {
      return {
        success: true,
        data: result.data,
        message: "Xóa thành công",
      };
    } else {
      return {
        success: false,
        message: result.message || "Có lỗi xảy ra",
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại sau!" };
  }
}
