export interface OrderMessage {
  order_id: string;
  customer_id: string;
  products: {
    id: string;
    quantity: number;
  }[];
  total_amount: number;
  created_at: string;
}
