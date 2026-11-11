export interface Order { 
  id: string; 
  restaurantId: number; 
  items: string[]; 
  status: string; 
}
 
export interface OrderRepository {
  save(order: Order): Promise<void>;
  get(id: string): Promise<Order | undefined>;
}
 
export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');