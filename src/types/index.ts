import { categoryMap } from "../utils/constants";
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
export type Category = keyof typeof categoryMap;

 export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: Category;
  price: number | null; 
}
 
export type TPayment = 'card' | 'cash' | ''

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IOrder extends IBuyer {
  items: string[];
  total: number;
}

export interface IOrderResult {
  id: string;
  total: number;
}

export interface IServerProductResponse {
    total: number;
    items: IProduct[];
}