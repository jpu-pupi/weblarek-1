import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface ICartView {
    items: HTMLElement[];
    total: number;
}

export class CartView extends Component<ICartView> {
    private basketPrice: HTMLElement;
    private orderBasket: HTMLButtonElement;
    private basketList: HTMLElement;

    constructor (protected events: IEvents, container: HTMLElement) {
        super(container);

        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.orderBasket = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);

        this.orderBasket.addEventListener('click', () => {
            this.events.emit('basket:checkout')
        })
    }

     set items(items: HTMLElement[]) {
        this.basketList.innerHTML ='';
        items.forEach(item => this.basketList.appendChild(item))
    }

    set total(value: number) {
        this.basketPrice.textContent = `${value} синапсов`;
    }

    set orderButtonDisabled (value: boolean) {
        this.orderBasket.disabled = value;
    }
}

