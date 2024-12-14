import Cookies from "js-cookie";

// LOGIN
export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );
    const result = await response.json();
    if (response.ok) {
      Cookies.set("session", result.data.token, {
        expires: result.data.expires_in,
      });
      return { success: true, message: "Đăng nhập thành công" };
    } else {
      if (result.message === "Tài khoản này chưa được xác thực") {
        return {
          success: false,
          message: "Tài khoản này chưa được xác thực",
        };
      } else {
        return {
          success: false,
          message: result.message || "Đăng nhập thất bại",
        };
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra, vui lòng thử lại sau!" };
  }
}

// SIGN UP
export async function signup(data: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  passwordConfirm: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();

    if (response.ok) {
      return { success: true, message: "Đăng ký thành công!" };
    } else {
      return { success: false, message: result.message || "Đăng ký thất bại" };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra, vui lòng thử lại sau!" };
  }
}

// GENERATE OTP
export async function generateOTP(
  email: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/generateOTP`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );
    const result = await response.json();

    if (response.ok) {
      return { success: true, message: result.message };
    } else {
      return {
        success: false,
        message: result.message || "Có lỗi khi tạo mã OTP",
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra, vui lòng thử lại sau!" };
  }
}

// VERIFY OTP
export async function verifyOTP(
  email: string,
  code: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/verifyOTP`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      }
    );

    const result = await response.json();
    if (response.ok) {
      Cookies.set("session", result.data.token, {
        expires: result.data.expires_in,
      });
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result.message || "Xác thực thất bại" };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra, vui lòng thử lại sau!" };
  }
}

// FORGOT PASSWORD
export async function forgotPassword(
  email: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/forgotPassword`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const result = await response.json();
    if (response.ok) {
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result.message || "Có lỗi xảy ra" };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra, vui lòng thử lại sau!" };
  }
}

// RESET PASSWORD
export async function resetPassword(
  token: string,
  password: string,
  passwordConfirm: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/resetPassword`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, passwordConfirm }),
      }
    );

    const result = await response.json();
    if (response.ok) {
      Cookies.set("session", result.data.token, {
        expires: result.data.expires_in,
      });
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result.message || "Có lỗi xảy ra" };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra, vui lòng thử lại sau!" };
  }
}

// GET USER
export async function getUser(): Promise<{
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    // Kiểm tra nếu phản hồi thành công
    if (response.ok) {
      return { success: true, data: result.data };
    } else {
      return {
        success: false,
        message: result.message || "Lỗi khi lấy ra người dùng",
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại sau!" };
  }
}

// UPDATE USSER INFO
export async function updateUserInfo(
  name: string,
  gender: string,
  date: Date,
  file?: File
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

    const formData = new FormData();
    if (file) {
      formData.append("avatar", file);
    }
    formData.append("name", name);
    formData.append("gender", gender);
    formData.append("birth", date?.toISOString());

    // Gửi yêu cầu đến API để lấy thông tin người dùng
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/updateProfile`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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
        message: result.message || "Lỗi khi lấy ra người dùng",
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại sau!" };
  }
}

// UPDATE USER LOCATION
export async function updateUserLocation(data: {
  province: string;
  district: string;
  address: string;
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/updateLocation`,
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
        message: result.message || "Lỗi khi lấy ra người dùng",
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại sau!" };
  }
}

export async function getAllBrand(): Promise<{
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/brands/`,
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

// CREATE BRAND
export async function createBrand(data: {
  name: string;
  description: string;
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/brands/`,
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

// UPDATE BRAND
export async function updateBrand(
  data: {
    name: string;
    description: string;
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/brands/${id}`,
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

// UPDATE BRAND
export async function deleteBrand(id: string): Promise<{
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/brands/${id}`,
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
