export interface Discount {
  id: number;
  name: string;
  value: number;
  stateId: number;
}

export interface DiscountCreate {
  name: string;
  value: number;
  stateId: number;
}
