import { Api } from '../base/Api';
import { IOrderPost, IOrderResult, IProductsResponse } from '../../types';

export class LarekApi {
    private _api: Api;

    constructor(api: Api) {
        this._api = api;
    }

    getProductsList(): Promise<IProductsResponse> {
        return this._api.get('/product/') as Promise<IProductsResponse>;
    }

    postOrder(order: IOrderPost): Promise<IOrderResult> {
        return this._api.post('/order/', order) as Promise<IOrderResult>;
    }
}

