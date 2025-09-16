interface OrderItem {
  id: string;
  quantity: number;
  origin_price: number;
  order_id: string;
  variant_id: string;
  createdAt: string;
  updatedAt: string;
  Variant: Variant_Product;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Order {
  id: string;
  order_date: string;
  delivered_date: string | null;
  status: string;
  payment_method: string;
  payment_status: string;
  total_amount: number;
  user_id: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface OrderDetail {
  id: string;
  order_date: string;
  delivered_date: string | null;
  status: string;
  payment_method: string;
  payment_status: string;
  total_amount: number;
  user_id: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  User: UserDetail;
}

interface UserDetail {
  id: string;
  name: string;
  phone: string;
  address: string;
  email: string;
}
