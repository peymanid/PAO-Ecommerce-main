import { components } from "./api";

export type CartUpdate = {
  id?: string;
  customerId?: string;
  products: components['schemas']['Products'][];
  total: number;
};
