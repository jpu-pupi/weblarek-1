import {IProduct} from '../../../types/index'

export class Cart {
    private items: IProduct[] = [];

    getItems(): IProduct[] {
        return this.items
    }
    addItem(item: IProduct): void {
        this.items.push(item)
    }
    deleteItem(item: IProduct): void {
        const deleteItem = item;
        this.items = this.items.filter(item => item !== deleteItem);
    }

    clear(): void {
        this.items = [];
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