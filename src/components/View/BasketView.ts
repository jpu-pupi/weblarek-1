import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IBasket {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasket> {
    private basketPrice: HTMLElement;
    private buttonBasket: HTMLButtonElement;
    private basketList: HTMLElement;

    constructor (protected events: IEvents, container: HTMLElement) {
        super(container);

        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.buttonBasket = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);

        this.buttonBasket.addEventListener('click', () => {
            this.events.emit('basket:checkout')
        })
    }

     addItem(item: HTMLElement): void {
        this.basketList.appendChild(item);
    }

    get itemsCount(): number {
        return this.basketList.children.length;
    }

    set total(value: number) {
        this.basketPrice.textContent = `${value} синапсов`;
    }
}

