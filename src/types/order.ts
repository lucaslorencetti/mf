export interface OrderProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customer_id: string;
  total_amount: number;
  created_at: Date;
  products: OrderProduct[];
}
