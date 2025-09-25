// hooks/useLandingProducts.ts
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export function useLandingProducts() {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/landing`,
    fetcher
  );

  return {
    outstanding: data?.data?.outstanding?.products ?? [],
    tablets: data?.data?.tablets?.products ?? [],
    laptops: data?.data?.laptops?.products ?? [],
    phones: data?.data?.phones?.products ?? [],
    isLoading,
    isError: error,
  };
}
