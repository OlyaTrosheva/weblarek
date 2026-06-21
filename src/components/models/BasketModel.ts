import { IProduct } from '../../types';

export class BasketModel {
    private _items: IProduct[] = [];

    getItems(): IProduct[] {
        return this._items;
    }

    add(product: IProduct): void {
        if (!this.hasProduct(product.id)) {
            this._items.push(product);
        }
    }

    remove(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
    }

    clear(): void {
        this._items = [];
    }

    getTotal(): number {
        return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    getCount(): number {
        return this._items.length;
    }

    hasProduct(id: string): boolean {
        return this._items.some(item => item.id === id);
    }
}
