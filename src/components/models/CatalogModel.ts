import { IProduct } from '../../types';
import { IEvents } from '../base/events';

export class CatalogModel {
    private items: IProduct[] = [];
    private preview: IProduct | null = null;
    private events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit('items:changed');
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getProduct(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setPreview(item: IProduct | null): void {
        this.preview = item;
        this.events.emit('preview:changed', item);
    }

    getPreview(): IProduct | null {
        return this.preview;
    }
}

