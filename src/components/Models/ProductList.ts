import {IProduct} from '../../types/index';
import { IEvents } from '../base/Events';

export class ProductList {
    private items: IProduct[];
    private previewItem: IProduct | null;

    constructor(private events: IEvents) {
        this.items = [];
        this.previewItem = null;
    }

    setItems(items: IProduct[]): void {
        this.items = [...items];
        this.events.emit('productList:changed', this.items);
    }

    getItems(): IProduct[] {
        return [...this.items];
    }

    getItem(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setPreviewItem(item: IProduct): void {
       this.previewItem = item;
       this.events.emit('product:selected', item);
    }

    getPreviewItem(): IProduct | null {
        return this.previewItem
    }

}