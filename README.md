# 📱 CellphoneS E-Commerce Website  


Dự án website bán hàng CellphoneS cho phép người dùng mua sắm trực tuyến, theo dõi đơn hàng và quản trị viên quản lý hệ thống.  

## 🚀 Tính năng chính

### 👤 User
- Đăng ký / đăng nhập tài khoản  
- Xem danh mục sản phẩm, chi tiết sản phẩm  
- Bình luận sản phẩm  
- Nhắn tin trực tiếp với admin (realtime)  
- Thêm sản phẩm vào giỏ hàng  
- Thêm sản phẩm vào yêu thích  
- Thanh toán đơn hàng  
- Theo dõi trạng thái vận chuyển theo thời gian thực  


### 🛠️ Admin
- Quản lý sản phẩm (thêm, sửa, xóa)  
- Quản lý đơn hàng  
- Quản lý người dùng  
- Quản lý trạng thái giao hàng  
- Quản lý tin nhắn với người dùng  

---

## 🏗️ Công nghệ sử dụng
- **Frontend**: Next.js + TypeScript, Tailwind CSS, Zustand  
- **Backend**: Node.js (Express/NestJS)  
- **Database**: MySQL (railway)
- **Authentication**: NextAuth / JWT  
- **Triển khai**: Vercel (FE) + Render (BE)   

---

## ⚙️ Cài đặt & chạy dự án

### Cách chạy local
```bash
# Clone dự án
git clone https://github.com/minhthang0207/cellphones.git
# Cài đặt dependencies
cd cellphones
npm install

# Tạo file .env và cấu hình
# Copy file .env.example thành .env.local và điền thông tin phù hợp

# Chạy server
npm run dev


```

## 🔗 Backend
Dự án này cần chạy kèm backend: [CellphoneS Backend](https://github.com/minhthang0207/cellphones_BE)


## 💳 Thanh toán online

Dự án hỗ trợ thanh toán qua **ZaloPay**. Bạn có thể thử nghiệm thanh toán bằng các cách sau:

1. **Sử dụng ZaloPay Sandbox**
   - Truy cập: [ZaloPay Test Wallets](https://docs.zalopay.vn/vi/docs/developer-tools/test-instructions/test-wallets/)
   - Tải **Zalo Sandbox App** và đăng nhập bằng các tài khoản test được cung cấp trên trang web (hoặc tạo tài khoản cá nhân).
   - Thực hiện thanh toán trên website.

2. **Sử dụng tài khoản ZaloPay đã có sẵn**
    - Truy cập: [ZaloPay Test Wallets](https://docs.zalopay.vn/vi/docs/developer-tools/test-instructions/test-wallets/)
    - Sử dụng các thẻ ngân hàng kiểm thử

> Lưu ý: Môi trường test sẽ không trừ tiền thật, chỉ mô phỏng giao dịch.
---

## 👤 Tài khoản admin (dùng để đăng nhập và quản lý)
- Email: `ad@gmail.com`
- Mật khẩu: `123456`


# Giao diện website

Trang chủ
![image_alt](https://github.com/minhthang0207/cellphones/blob/main/public/docs/homepage_user.png?raw=true)

Trang chủ admin
![image_alt](https://github.com/minhthang0207/cellphones/blob/main/public/docs/homepage_admin.png?raw=true)

