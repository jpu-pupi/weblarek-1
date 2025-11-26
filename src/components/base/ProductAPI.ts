import { IApi, IProduct, IOrder, IOrderResult, IServerProductResponse } from '../../types/index';

export class ProductAPI {
    constructor(private api: IApi) {}

    async getProductList(): Promise<IProduct[]> {
        
        const response = await this.api.get<IServerProductResponse>('/product/');
        return response.items;
    }

    async submitOrder(orderData: IOrder): Promise<IOrderResult> {
        return await this.api.post<IOrderResult>('/order/', orderData);
    }
}