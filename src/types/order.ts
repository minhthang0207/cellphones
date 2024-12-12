interface OrderProduct {
  id: string;
  name: string;
  quantity: number;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Order {
  id: string;
  items: OrderProduct[];
  date: string;
  total: number;
}
