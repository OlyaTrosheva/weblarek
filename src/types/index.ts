export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Наши добавленные типы для проекта 
export type TPayment = 'card' | 'cash' | '';
// Товар
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
} 
// Покупатель
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export type TFormErrors = {
    payment?: string;
    email?: string;
    phone?: string;
    address?: string;
};

export interface IOrderPost extends IBuyer {
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IProductsResponse {
    total: number;
    items: IProduct[];
}