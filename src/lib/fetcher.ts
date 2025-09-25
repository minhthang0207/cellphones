// lib/fetcher.ts
export const fetcher = async (url: string) => {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Có lỗi xảy ra khi fetch API");
  }

  return res.json(); // SWR sẽ nhận luôn object JSON
};
