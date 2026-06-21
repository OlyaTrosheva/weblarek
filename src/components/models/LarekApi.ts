import { IApi, IOrderPost, IOrderResult, IProductsResponse } from '../../types';

export class LarekApi {
    private _api: IApi;

    constructor(api: IApi) {
        this._api = api;
    }

    getProductsList(): Promise<IProductsResponse> {
        return this._api.get<IProductsResponse>('/product/');
    }

    postOrder(order: IOrderPost): Promise<IOrderResult> {
        return this._api.post<IOrderResult>('/order/', order);
    }
}


