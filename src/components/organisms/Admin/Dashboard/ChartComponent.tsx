"use client";

import { useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Title,
  LineController,
  BarElement,
  BarController,
  ChartTypeRegistry,
  TooltipItem,
} from "chart.js";

// Register components for both types
ChartJS.register(
  LineController,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Title,
  BarController,
  BarElement
);

interface Data {
  label: string;
  start: string;
  end: string;
  total_orders: number;
  total_amount: number;
}

const createChart = (
  ctx: CanvasRenderingContext2D,
  type: keyof ChartTypeRegistry,
  labels: string[],
  data: number[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  datasets: any[]
) => {
  return new ChartJS(ctx, {
    type,
    data: {
      labels,
      datasets,
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        tooltip: {
          callbacks: {
            label: (tooltipItem: TooltipItem<keyof ChartTypeRegistry>) => {
              // Type assertion to ensure raw is treated as a number
              return `Giá trị: ${(tooltipItem.raw as number).toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        x: { title: { display: true, text: "Tháng" } },
        y: { title: { display: true, text: "Giá trị" }, beginAtZero: true },
      },
    },
  });
};

const ChartComponent = ({
  type,
  data,
  isLoading,
}: {
  type: "line" | "bar";
  data: Data[];
  isLoading: boolean;
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null); // Lưu tham chiếu biểu đồ

  useEffect(() => {
    if (isLoading || !chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;
    // Hủy biểu đồ cũ nếu nó tồn tại
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = data.map((item) => item.label);
    const totalOrders = data.map((item) => item.total_orders);
    const totalAmount = data.map((item) => item.total_amount);

    const datasets = [
      {
        label: "Tổng số đơn hàng",
        data: totalOrders,
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Tổng doanh thu (VNĐ)",
        data: totalAmount,
        backgroundColor: "rgba(255, 99, 132, 0.7)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ];

    // Tạo biểu đồ mới và lưu vào ref
    chartInstanceRef.current = createChart(
      ctx,
      type,
      labels,
      totalOrders,
      datasets
    );

    // Cleanup khi component bị unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [isLoading, data, type]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-fit">
        <div className="animate-pulse w-[80%] h-[400px] bg-gray-300"></div>
      </div>
    );
  }

  return <canvas ref={chartRef} width="400" height="200"></canvas>;
};

export default ChartComponent;
