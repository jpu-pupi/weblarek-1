import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { categoryMap } from "../../utils/constants";


interface ICard {
    title: string;
    price: number | null;
}

export class Card extends Component<ICard> {
    protected itemTitle: HTMLElement;
    private itemPrice: HTMLElement;

    constructor (container: HTMLElement) {
        super(container);

        this.itemTitle = ensureElement<HTMLElement>('.card__title', this.container);
        this.itemPrice = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title (value: string) {
        this.itemTitle.textContent = value;
    }

    set price (value: number | null) {
        if (value === null) {
            this.itemPrice.textContent = 'Бесценно';
        } else {
            this.itemPrice.textContent = value +' синапсов';
        }
        
    }
}

export class CardCatalog extends Card {
    private itemCategory: HTMLElement;
    private itemImage: HTMLImageElement;
    private itemButton: HTMLButtonElement;

    constructor(private events: IEvents, container: HTMLElement, private cardID: string) {
        super(container);

        this.itemCategory = ensureElement<HTMLElement>('.card__category', this.container);
        this.itemImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.itemButton = container as HTMLButtonElement;

        this.itemButton.addEventListener('click', () => {
            this.events.emit('card:select', { id: this.cardID});
        })
    }

    set category (value: string) {
        this.itemCategory.textContent = value;
        Object.values(categoryMap).forEach(className => {
            this.itemCategory.classList.remove(className);
        })

        const modifier = categoryMap[value as keyof typeof categoryMap];
        if (modifier) {
            this.itemCategory.classList.add(modifier);
        }
    }

    set image (value: string) {
        this.setImage(this.itemImage, value, this.title);
    }
}


export class CardBasket extends Card {
    private itemIndex: HTMLElement;
    private buttonItemDelete: HTMLButtonElement;

    constructor(private events: IEvents, container: HTMLElement, private cardID: string) {
        super(container);

        this.itemIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.buttonItemDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.buttonItemDelete.addEventListener('click', () => {
            this.events.emit('card:delete', { id: this.cardID});
        })

    }

    set index (value: number) {
        this.itemIndex.textContent = value.toString();
    }
}

export class CardPreview extends Card {
    private itemCategory: HTMLElement;
    private itemImage: HTMLImageElement;
    private itemButton: HTMLButtonElement;
    private inCart: boolean = false;
    private itemDescription: HTMLElement

    constructor(private events: IEvents, container: HTMLElement, private cardID: string) {
        super(container);

        this.itemCategory = ensureElement<HTMLElement>('.card__category', this.container);
        this.itemImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.itemButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.itemDescription = ensureElement<HTMLElement>('.card__text', this.container);

        this.itemButton.addEventListener('click', () => {
            if (this.inCart) {
                this.events.emit('card:remove', { id: this.cardID })
            } else {
                this.events.emit('card:add', { id: this.cardID });
            }
        })
    }

    set category (value: string) {
        this.itemCategory.textContent = value;
        Object.values(categoryMap).forEach(className => {
            this.itemCategory.classList.remove(className);
        })

        const modifier = categoryMap[value as keyof typeof categoryMap];
        if (modifier) {
            this.itemCategory.classList.add(modifier);
        }
    }

    set image (value: string) {
        this.setImage(this.itemImage, value, this.title);
    }

    set description (value: string) {
        this.itemDescription.textContent = value;
    }

    set inCartStatus(value: boolean) {
        this.inCart = value;

        if (this.itemButton) {
            this.itemButton.textContent = value ? 'Удалить из корзины': 'Купить';
        }
    }
}