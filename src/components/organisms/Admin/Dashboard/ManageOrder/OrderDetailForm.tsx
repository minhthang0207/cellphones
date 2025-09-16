"use client";
import { getOrderByOrderId } from "@/lib";
import Image from "next/image";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useEffect, useState } from "react";

import { writeFileXLSX, utils } from "xlsx";
interface OrderDetailFormProps {
  slug: string;
}
declare module "jspdf" {
  interface jsPDF {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    autoTable: any;
  }
}

const OrderDetailForm: React.FC<OrderDetailFormProps> = ({ slug }) => {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const exportToExcel = (order: OrderDetail) => {
    // Prepare the order summary data
    const orderSummary = [
      { label: "Mã đơn hàng", value: order.id },
      {
        label: "Ngày đặt hàng",
        value: new Date(order.order_date).toLocaleString(),
      },
      { label: "Trạng thái", value: order.status },
      {
        label: "Khách hàng",
        value: `${order.User.name} - ${order.User.phone}`,
      },
      { label: "Địa chỉ", value: order.User.address },
      { label: "Phương thức thanh toán", value: order.payment_method },
      { label: "Trạng thái thanh toán", value: order.payment_status },
      {
        label: "Tổng tiền",
        value: `${order.total_amount.toLocaleString()} VND`,
      },
    ];

    // Prepare the product details data
    const productDetails = order.items.map((item) => ({
      ProductName: item.Variant.Product.name,
      Color: item.Variant.Color.name,
      RAM: `${item.Variant.Ram.capacity} GB`,
      ROM: `${item.Variant.Rom.capacity} GB`,
      Quantity: item.quantity,
      Price: `${item.origin_price.toLocaleString()} VND`,
    }));

    // Create worksheet for the order summary (first section of the sheet)
    const summaryWs = utils.json_to_sheet(orderSummary, {
      header: ["label", "value"], // Define custom header for summary
    });

    // Add a row for spacing between order summary and products

    // Create worksheet for product details (second section of the sheet)
    const productWs = utils.json_to_sheet(productDetails);

    // Create a new workbook
    const wb = utils.book_new();

    // Append the order summary sheet
    utils.book_append_sheet(wb, summaryWs, "Đơn hàng");

    // Append the product details sheet
    utils.book_append_sheet(wb, productWs, "Chi tiết sản phẩm");

    // Export as Excel file
    writeFileXLSX(wb, `${order.id}_Chi-tiet-don-hang.xlsx`);
  };

  const loadFontBase64 = async () => {
    const response = await fetch("/assets/fontBase64.txt");
    const fontBase64 = await response.text();

    return fontBase64;
  };

  const exportToPDF = async (order: OrderDetail) => {
    const fontBase64 = await loadFontBase64(); // Tải font base64 từ file

    const doc = new jsPDF("p", "mm", "a4"); // A4 size PDF in portrait mode

    // Thêm font vào VFS
    doc.addFileToVFS("custom-font.ttf", fontBase64);
    doc.addFont("custom-font.ttf", "custom", "normal"); // Đăng ký font mới

    // Đăng ký phông chữ mới
    doc.setFont("custom", "normal");
    doc.setFontSize(12); // Set font size

    // Thêm tiêu đề (Order Details)
    doc.setTextColor(255, 255, 255); // Màu chữ trắng
    doc.setFillColor(237, 34, 41); // Màu nền đỏ
    doc.rect(0, 0, 210, 20, "F"); // Thêm nền màu
    doc.setTextColor(255, 255, 255); // Màu chữ trắng
    doc.text("CHI TIẾT ĐƠN HÀNG", 105, 10, { align: "center" });

    // Thêm phần thông tin đơn hàng (ngoài bảng)
    doc.setTextColor(0, 0, 0); // Màu chữ đen
    doc.setFontSize(12);
    doc.text(`Mã đơn hàng: ${order.id}`, 10, 30);
    doc.text(
      `Ngày đặt hàng: ${new Date(order.order_date).toLocaleString()}`,
      10,
      40
    );
    doc.text(`Trạng thái: ${order.status}`, 10, 50);
    doc.text(`Khách hàng: ${order.User.name} - ${order.User.phone || order.User.email}`, 10, 60);
    doc.text(`Địa chỉ: ${order.User.address}`, 10, 70);
    doc.text(`Phương thức thanh toán: ${order.payment_method}`, 10, 80);
    doc.text(`Trạng thái thanh toán: ${order.payment_status}`, 10, 90);

    // Tạo bảng cho danh sách sản phẩm
    doc.setFontSize(12); // Font size cho bảng
    doc.text("Sản phẩm", 10, 100);

    // Chuẩn bị dữ liệu cho bảng
    const items = order.items.map((item) => [
      item.Variant.Product.name,
      item.Variant.Color.name,
      `${item.Variant.Ram.capacity} GB`,
      `${item.Variant.Rom.capacity} GB`,
      item.quantity,
      `${item.origin_price.toLocaleString()} VND`,
    ]);

    // Tạo bảng cho các sản phẩm
    doc.autoTable({
      head: [["Tên sản phẩm", "Màu sắc", "RAM", "ROM", "Số lượng", "Giá"]],
      body: items,
      startY: 110,
      theme: "grid",
      styles: {
        fontSize: 10, // Adjust font size for table
        font: "custom", // Chỉ định font cho bảng
      },
      headStyles: {
        fillColor: [237, 34, 41],
        textColor: [255, 255, 255],
        fontSize: 12,
        font: "custom", // Chỉ định font cho tiêu đề
      },
      bodyStyles: {
        fontSize: 10,
        textColor: [0, 0, 0],
        font: "custom", // Chỉ định font cho nội dung
      },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
      },
    });

    // Thêm phần tổng tiền sau bảng sản phẩm
    doc.setFontSize(12);
    doc.text(
      `Tổng tiền: ${order.total_amount.toLocaleString()} VND`,
      10,
      doc.autoTable.previous.finalY + 10
    );

    // Footer Section (consistent with header color)
    doc.setFillColor(237, 34, 41);
    doc.rect(0, doc.internal.pageSize.height - 20, 210, 20, "F"); // Red footer
    doc.setTextColor(255, 255, 255); // White text color for footer
    doc.text(
      "Cảm ơn bạn đã đặt hàng!",
      105,
      doc.internal.pageSize.height - 10,
      {
        align: "center",
      }
    );

    // Save PDF
    doc.save(`${order.id}_Chi-tiet-don-hang.pdf`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await getOrderByOrderId(slug);
      if (result.success) {
        setOrder(result.data.order);
        console.log(result.data);
      }
      setIsLoading(false);
    };
    if (slug) {
      fetchData();
    }
  }, [slug]);

  if(isLoading) {
    return <div>Đang chờ load dữ liệu</div>
  }

  return (
    <div className="p-4">
      {order && (
        <div className="bg-white min-h-screen py-10 px-4 sm:px-10">
          {/* Export Buttons */}
          <div className="mb-8 flex justify-end space-x-4 w-full">
            <button
              onClick={() => exportToExcel(order)}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
            >
              Xuất Excel
            </button>
            <button
              onClick={() => exportToPDF(order)}
              className="bg-primary-400 text-white py-2 px-4 rounded-md hover:bg-primary-300"
            >
              Xuất PDF
            </button>
          </div>
          <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md border border-gray-200">
            {/* Header */}
            <div className="bg-red-500 text-white text-center py-4 rounded-t-md">
              <h1 className="text-2xl font-bold">CHI TIẾT ĐƠN HÀNG</h1>
            </div>

            {/* Order Summary */}
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-red-500">
                  Thông tin đơn hàng
                </h2>
                <p>
                  <span className="font-bold">Mã đơn hàng:</span> {order.id}
                </p>
                <p>
                  <span className="font-bold">Ngày đặt hàng:</span>{" "}
                  {new Date(order.order_date).toLocaleString()}
                </p>
                <p>
                  <span className="font-bold">Khách hàng:</span>{" "}
                  {order.User.name} - {order.User.phone}
                </p>
                <p>
                  <span className="font-bold">Địa chỉ:</span>{" "}
                  {order.User.address}
                </p>
                <p>
                  <span className="font-bold">Trạng thái:</span> {order.status}
                </p>
                <p>
                  <span className="font-bold">Phương thức thanh toán:</span>{" "}
                  {order.payment_method}
                </p>
                <p>
                  <span className="font-bold">Trạng thái thanh toán:</span>{" "}
                  {order.payment_status}
                </p>
                <p>
                  <span className="font-bold">Tổng tiền:</span>{" "}
                  {order.total_amount.toLocaleString()} VND
                </p>
              </div>

              {/* Items */}
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-red-500">Sản phẩm</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border border-red-200 rounded-md flex flex-col sm:flex-row items-start sm:items-center"
                    >
                      {/* Product Image */}
                      <Image
                        src={item.Variant.Product.image}
                        alt={item.Variant.name}
                        width={100}
                        height={100}
                        className="rounded-md"
                      />
                      {/* Product Details */}
                      <div className="sm:ml-6 mt-4 sm:mt-0">
                        <p className="font-bold text-red-500">
                          {item.Variant.Product.name}
                        </p>
                        <p>Màu sắc: {item.Variant.Color.name}</p>
                        <p>RAM: {item.Variant.Ram.capacity} GB</p>
                        <p>ROM: {item.Variant.Rom.capacity} GB</p>
                        <p>Số lượng: {item.quantity}</p>
                        <p>Giá: {item.origin_price.toLocaleString()} VND</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-red-500 text-white py-4 rounded-b-md text-center">
              <p className="text-sm">Thông tin chi tiết!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default OrderDetailForm;
