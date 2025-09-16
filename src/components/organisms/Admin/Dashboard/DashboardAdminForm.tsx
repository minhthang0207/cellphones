"use client";

import { useEffect, useState } from "react";
import ChartComponent from "./ChartComponent";
import CounterCard from "./CouterCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getStatisticChart, getStatisticSummary } from "@/libStatistic";
interface Data {
  label: string;
  start: string;
  end: string;
  total_orders: number;
  total_amount: number;
}

const DashboardAdminForm: React.FC = () => {
  const [data, setData] = useState<Data[]>([]);

  const [totalOrder, setTotalOrder] = useState(0);
  const [totalFinance, setTotalFinance] = useState(0);
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [isBarChart, setIsBarChart] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: 12,
    period: "month",
  });

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({ ...formData, year: Number.parseInt(value) });
  };

  const handlePeriodChange = (value: string) => {
    if (value === "month") {
      setFormData({
        ...formData,
        period: value,
        month: 3,
      });
      return;
    }
    setFormData({
      ...formData,
      period: value,
      month: 0,
    });
  };

  const handleMonthChange = (value: string) => {
    setFormData({
      ...formData,
      month: Number.parseInt(value),
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const result = await getStatisticChart({
      months: formData.month,
      period: formData.period,
      year: formData.year,
    });
    if (result.success) {
      setData(result.data);
      const totalOrders = result.data.reduce(
        (sum: number, item: Data) => sum + item.total_orders,
        0
      );

      setTotalOrder(totalOrders);

      const totalFinances = result.data.reduce(
        (sum: number, item: Data) => sum + item.total_amount,
        0
      );
      setTotalFinance(totalFinances);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Gọi song song hai API
        const [chartResult, summaryResult] = await Promise.all([
          getStatisticChart({
            months: formData.month,
            period: formData.period,
            year: formData.year,
          }),
          getStatisticSummary(),
        ]);

        // Xử lý kết quả của getStatisticChart
        if (chartResult.success) {
          setData(chartResult.data);

          const totalOrders = chartResult.data.reduce(
            (sum: number, item: Data) => sum + item.total_orders,
            0
          );
          setTotalOrder(totalOrders);

          const totalFinances = chartResult.data.reduce(
            (sum: number, item: Data) => sum + item.total_amount,
            0
          );
          setTotalFinance(totalFinances);
        }

        // Xử lý kết quả của getStatisticSummary
        if (summaryResult.success) {
          setTotalCustomer(summaryResult.data.userCount);
          setTotalProduct(summaryResult.data.productCount);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (formData.month && formData.period && formData.year) {
      fetchData();
    }
  }, [formData.month, formData.period, formData.year]); // Thêm formData vào dependencies nếu cần

  return (
    <div className="p-4">
      <div className="grid grid-cols-4 gap-8 ">
        <CounterCard
          finalValue={totalOrder}
          image_url="/admin-box.png"
          label="Tổng đơn hàng"
        />
        <CounterCard
          finalValue={totalFinance}
          image_url="/admin-money.png"
          label="Tài chính"
          numberLarge={true}
        />
        <CounterCard
          finalValue={totalProduct}
          image_url="/admin-product.jpg"
          label="Sản phẩm"
        />
        <CounterCard
          finalValue={totalCustomer}
          image_url="/admin-user.png"
          label="Khách hàng"
        />
      </div>
      <div className="bg-white rounded-lg p-4 shadow-md mt-4 flex gap-4">
        <div className="w-[80%]">
          {isBarChart ? (
            <ChartComponent type="bar" data={data} isLoading={isLoading} />
          ) : (
            <ChartComponent type="line" data={data} isLoading={isLoading} />
          )}
          <div className="w-full flex justify-center mt-4 gap-4">
            <button
              type="button"
              className={`border px-4 py-1 text-sm rounded-lg ${
                isBarChart && "border-2 border-red-500"
              }`}
              onClick={() => setIsBarChart(true)}
            >
              Biểu đồ cột
            </button>
            <button
              type="button"
              className={`border px-4 py-1 text-sm rounded-lg ${
                !isBarChart && "border-2 border-red-500"
              }`}
              onClick={() => setIsBarChart(false)}
            >
              Biểu đồ đường
            </button>
          </div>
        </div>
        <div className="w-[20%]">
          <div className="w-full">
            <h6 className="text-center font-semibold">Bộ lọc</h6>
            <div className="flex flex-col gap-4">
              {/* col1 */}
              <div>
                <p>Năm:</p>
                <Input
                  placeholder=""
                  type="number"
                  className="border-2"
                  value={formData.year.toString() || ""}
                  onChange={(e) => handleChangeInput(e)}
                />
              </div>
              {/* col2 */}
              <div>
                <p>Lọc theo:</p>
                <Select
                  value={formData.period}
                  onValueChange={handlePeriodChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn dung lượng ram" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Ram</SelectLabel>
                      {listPeriod?.map((item) => {
                        return (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {formData.period === "month" && (
                <div>
                  <p>Tháng:</p>
                  <Select
                    value={formData.month.toString()}
                    onValueChange={handleMonthChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn dung lượng ram" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Ram</SelectLabel>
                        {listMonth?.map((item) => {
                          return (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <button
                className="bg-blue-400 py-2 w-full text-white rounded-lg"
                type="button"
                onClick={() => handleSubmit()}
              >
                Lọc
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdminForm;

const listMonth = [
  {
    label: "3 tháng",
    value: "3",
  },
  {
    label: "6 tháng",
    value: "6",
  },
  {
    label: "9 tháng",
    value: "9",
  },
  {
    label: "12 tháng",
    value: "12",
  },
];

const listPeriod = [
  {
    label: "Tháng",
    value: "month",
  },
  {
    label: "Năm",
    value: "year",
  },
];
