export interface KafkaConsumer {
  connect(): Promise<void>;
  consume(): Promise<void>;
  disconnect(): Promise<void>;
}

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
