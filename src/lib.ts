import Cookies from "js-cookie";
import { ItemCheckout } from "./types/cart";

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

// GET ALL BRAND
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

// DELETE BRAND
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

// GET ALL RAM
export async function getAllRam(): Promise<{
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/rams/`,
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

// CREATE RAM
export async function createRam(data: {
  capacity: number;
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/rams/`,
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

// UPDATE RAM
export async function updateRam(
  data: {
    capacity: number;
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/rams/${id}`,
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

// DELETE RAM
export async function deleteRam(id: string): Promise<{
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/rams/${id}`,
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

// GET ALL ROM
export async function getAllRom(): Promise<{
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/roms/`,
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

// CREATE ROM
export async function createRom(data: {
  capacity: number;
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/roms/`,
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

// UPDATE ROM
export async function updateRom(
  data: {
    capacity: number;
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/roms/${id}`,
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

// DELETE ROM
export async function deleteRom(id: string): Promise<{
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/roms/${id}`,
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

// GET ALL COLOR
export async function getAllColor(): Promise<{
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/colors/`,
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

// CREATE COLOR
export async function createColor(data: {
  name: string;
  code: string;
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/colors/`,
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

// UPDATE COLOR
export async function updateColor(
  data: {
    name: string;
    code: string;
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/colors/${id}`,
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

// DELETE COLOR
export async function deleteColor(id: string): Promise<{
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/colors/${id}`,
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

// GET ALL CATEGORY
export async function getAllCategory(): Promise<{
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/product_categories/`,
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

// CREATE CATEGORY
export async function createCategory(data: {
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/product_categories/`,
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

// UPDATE CATEGORY
export async function updateCategory(
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/product_categories/${id}`,
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

// DELETE CATEGORY
export async function deleteCategory(id: string): Promise<{
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/product_categories/${id}`,
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

interface Filter {
  brand?: string[];
  price?: string[];
  ram?: string[];
  rom?: string[];
}

// GET PRODUCT FILTERED
export async function getFilteredProduct(
  sortOrder: string,
  categorySlug: string,
  filters?: Filter,
  limit?: number,
  currentPage?: number
): Promise<{
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  message?: string;
}> {
  try {
    const token = Cookies.get("session");

    const filterList: URLSearchParams = new URLSearchParams();
    if (filters) {
      if (filters.brand && filters.brand?.length > 0) {
        filterList.append("brandSlug", filters.brand.join(",").trim());
      }

      // Xử lý price
      if (filters.price && filters.price?.length > 0) {
        filterList.append("price", filters.price.join(",").trim());
      }

      if (filters.ram && filters.ram?.length > 0) {
        filterList.append("ram", filters.ram.join(","));
      }

      if (filters.rom && filters.rom?.length > 0) {
        filterList.append("rom", filters.rom.join(","));
      }
      if (limit) {
        filterList.append("limit", limit.toString());
      }
      if (currentPage) {
        filterList.append("page", currentPage.toString());
      }
    }

    // Kiểm tra sortOrder và thêm tham số sort nếu cần
    if (sortOrder === "noi-bat") {
      filterList.append("sort", "-average_rating"); //
    }

    if (sortOrder === "gia-tang-dan") {
      filterList.append("sort", "price");
    }

    if (sortOrder === "gia-giam-dan") {
      filterList.append("sort", "-price");
    }
    if (categorySlug) {
      filterList.append("categorySlug", categorySlug);
    }

    // Gửi yêu cầu đến API để lấy thông tin người dùng
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/products?${filterList.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Đặt trong headers
        },
      }
    );

    const result = await response.json();
    console.log(result.data);

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

// GET PRODUCT BY SLUG (SINGLEPRODUCT PAGE)
export async function getProductBySlug(productSlug: string): Promise<{
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  message?: string;
}> {
  try {
    // Gửi yêu cầu đến API để lấy thông tin người dùng
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/slug/${productSlug}`,
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

// GET PRODUCT BY CATEGORY
export async function getProductByCategorySlug(
  categorySlug: string,
  limit: number
): Promise<{
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  message?: string;
}> {
  try {
    const token = Cookies.get("session");

    // Gửi yêu cầu đến API để lấy thông tin người dùng
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?categorySlug=${categorySlug}&limit=${limit}`,
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

// GET OUTSTANDING PRODUCT
export async function getOutStandingProduct(): Promise<{
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  message?: string;
}> {
  try {
    const token = Cookies.get("session");

    // Gửi yêu cầu đến API để lấy thông tin người dùng
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/top-30-outstanding`,
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

// GET ALL PRODUCT
export async function getAllProduct(): Promise<{
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
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

// GET ALL PRODUCT ALL ATTRIBUTE
export async function getProductWithAllAttribute(productId: string): Promise<{
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
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
        data: result.data.product,
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

// CREATE PRODUCT
export async function createProduct(data: {
  name: string;
  price: string;
  origin: string;
  description: string;
  category_id: string;
  brand_id: string;
  product_image: File | null;
  product_images: File[] | [];
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

    const formData = new FormData();
    if (data.product_image) {
      formData.append("product_image", data.product_image);
    }
    if (data.product_images) {
      data.product_images.forEach((image) => {
        formData.append("product_images", image);
      });
    }
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("origin", data.origin);
    formData.append("description", data.description);
    formData.append("category_id", data.category_id);
    formData.append("brand_id", data.brand_id);

    // Gửi yêu cầu đến API để lấy thông tin người dùng
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/`,
      {
        method: "POST",
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

// UPDATE PRODUCT
export async function updateProduct(
  data: {
    name: string;
    price: string;
    origin: string;
    description: string;
    category_id: string;
    brand_id: string;
    product_image: File | null;
    product_images: File[] | [];
    removed_image_ids: string[];
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

    const formData = new FormData();
    if (data.product_image) {
      formData.append("product_image", data.product_image);
    }
    if (data.product_images) {
      data.product_images.forEach((image) => {
        formData.append("product_images", image);
      });
    }

    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("origin", data.origin);
    formData.append("description", data.description);
    formData.append("category_id", data.category_id);
    formData.append("brand_id", data.brand_id);
    formData.append(
      "removed_image_ids",
      JSON.stringify(data.removed_image_ids)
    );

    // Gửi yêu cầu đến API để lấy thông tin người dùng
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
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
        message: result.message || "Có lỗi xảy ra",
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại sau!" };
  }
}

// DELETE PRODUCT
export async function deleteProduct(id: string): Promise<{
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
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

// UPDATE PRODUCT
export async function updateProductImage(
  data: {
    product_image: File;
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

    const formData = new FormData();
    if (data.product_image) {
      formData.append("product_image", data.product_image);
    }

    // Gửi yêu cầu đến API để lấy thông tin người dùng
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/product_image/${id}`,
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
        message: result.message || "Có lỗi xảy ra",
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại sau!" };
  }
}

// DELETE CATEGORY
export async function deleteProductImage(id: string): Promise<{
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/product_image/${id}`,
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

// GET ALL VARIANT
export async function getAllVariantByProductId(productId: string): Promise<{
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}/variants/`,
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

// CREATE RAM
export async function createVariant(data: {
  name: string;
  stock_quantity: number;
  price: number;
  color_id: string;
  ram_id: string;
  rom_id: string;
  product_id: string;
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/variants/`,
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

// UPDATE RAM
export async function updateVariant(
  data: {
    name: string;
    stock_quantity: number;
    price: number;
    color_id: string;
    ram_id: string;
    rom_id: string;
    product_id: string;
  },
  variantId: string
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/variants/${variantId}`,
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

// DELETE RAM
export async function deleteVariant(variantId: string): Promise<{
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/variants/${variantId}`,
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

// GET ALL CART ITEM
export async function getAllCartItem(userId: string): Promise<{
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/carts`,
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

// CREATE CART ITEM
export async function createCartItem(
  userId: string,
  variantId: string
): Promise<{
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  message?: string;
}> {
  try {
    const token = Cookies.get("session");

    if (!token) {
      return {
        success: false,
        message: "Vui lòng đăng nhập để thực hiện thao tác này",
      };
    }

    // Gửi yêu cầu đến API để lấy thông tin người dùng
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/carts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Đặt trong headers
        },
        body: JSON.stringify({
          user_id: userId,
          variant_id: variantId,
          quantity: 1,
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

// UPDATE CART ITEM
export async function updateCartItem(
  itemId: string,
  quantity: number
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/carts/${itemId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Đặt trong headers
        },
        body: JSON.stringify({ quantity }),
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

// DELETE CART ITEM
export async function deleteCartItem(itemId: string): Promise<{
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/carts/${itemId}`,
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

// GET ALL ORDER
export async function getAllOrder(): Promise<{
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
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

// GET ORDER BY USER ID
export async function getAllOrderByUserId(
  userId: string,
  value: string
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/orders?status=${value}`,
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

// GET ORDER BY ORDER ID
export async function getOrderByOrderId(orderId: string): Promise<{
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`,
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

// CREATE ORDER
export async function createOrder(
  items: ItemCheckout[],
  totalAmount: number,
  paymentMethod: string,
  userId: string
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Đặt trong headers
        },
        body: JSON.stringify({
          items,
          totalAmount,
          paymentMethod,
          userId,
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

// UPDATE ORDER
export async function updateOrder(data: {
  orderId: string;
  status?: string;
  payment_status?: string;
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${data.orderId}`,
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

// DELETE ORDER
export async function deleteOrder(orderId: string): Promise<{
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`,
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

// CREATE PAYMENT
export async function createPayment(
  items: ItemCheckout[],
  totalAmount: number,
  userId: string
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Đặt trong headers
        },
        body: JSON.stringify({
          items,
          totalAmount,
          userId,
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
