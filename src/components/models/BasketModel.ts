import { IProduct } from '../../types';
import { IEvents } from '../base/events';

export class BasketModel {
    private items: IProduct[] = [];
    private events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    getItems(): IProduct[] {
        return this.items;
    }

    add(product: IProduct): void {
        if (!this.hasProduct(product.id)) {
            this.items.push(product);
            this.events.emit('basket:changed');
        }
    }

    remove(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
        this.events.emit('basket:changed');
    }

    clear(): void {
        this.items = [];
        this.events.emit('basket:changed');
    }

    getTotal(): number {
        return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    getCount(): number {
        return this.items.length;
    }

    hasProduct(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}

