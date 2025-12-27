import { IProduct } from "../../types";
import { IEvents } from "../base/Events";


export class Cart {
    private items: IProduct[] = [];

    constructor(private events: IEvents) {}

    getItems(): IProduct[] {
        return this.items
    }
    addItem(item: IProduct): void {
        this.items.push(item);
        this.events.emit('cart:changed', this.items);
    }

    deleteItem(item: IProduct): void {
        const deleteItem = item;
        this.items = this.items.filter(item => item !== deleteItem);
        this.events.emit('cart:changed', this.items);
    }

    clear(): void {
        this.items = [];
        this.events.emit('cart:changed', this.items);
    }

    getTotalPrice(): number {
       return this.items
       .map((item) => item.price ?? 0)
       .reduce((total, current)=>(total + current), 0);
    }

    getTotalQuantity(): number {
        return this.items.length;
    }

    inCart(id: string): boolean {
      return  this.items.some(item => item.id === id); 
    }

}