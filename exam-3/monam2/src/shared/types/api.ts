export interface ApiMessageResponse {
  message: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
}

export interface OrderCreatedResponse {
  orderId: string;
}
