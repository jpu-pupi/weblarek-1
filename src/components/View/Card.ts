import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { categoryMap } from "../../utils/constants";
import { Category } from "../../types";
import { CDN_URL } from "../../utils/constants";

interface ICardBase {
    title: string;
    price: number | null;
    id: string;
}

interface ICardBasket extends ICardBase {
    index: number;
}

interface ICardCatalog extends ICardBase {
    category: Category;
    image: string;
}

interface ICardPreview extends ICardCatalog {
    description: string;
}

export abstract class CardBase<T extends ICardBase = ICardBase> extends Component<T> {
    protected itemTitle: HTMLElement;
    protected itemPrice: HTMLElement;
    protected id: string;
    constructor (container: HTMLElement, id: string) {
        super(container);
        this.id = id;

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

export class CardBasket extends CardBase<ICardBasket> {
    private itemIndex: HTMLElement;
    private buttonItemDelete: HTMLButtonElement;
    protected events: IEvents;

    constructor(events: IEvents, container: HTMLElement, id: string) {
        super(container, id);
        this.events = events;

        this.itemIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.buttonItemDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.buttonItemDelete.addEventListener('click', () => {
            this.events.emit('card:delete', { id: this.id});
        })

    }

    set index (value: number) {
        this.itemIndex.textContent = value.toString();
    }
}

export class CardCatalog<T extends ICardCatalog = ICardCatalog> extends CardBase<T> {
    protected events: IEvents;
    protected itemCategory: HTMLElement;
    protected itemImage: HTMLImageElement;
    private containerButton: HTMLButtonElement;

    constructor(events: IEvents, container: HTMLElement, id: string) {
        super(container, id);
        this.events = events;

        this.itemCategory = ensureElement<HTMLElement>('.card__category', this.container);
        this.itemImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.containerButton = container as HTMLButtonElement;

        this.containerButton.addEventListener('click', () => {
            this.events.emit('card:select', { id: this.id});
        })
    }

    set category (value: Category) {
        this.itemCategory.textContent = value;
        Object.values(categoryMap).forEach(className => {
            this.itemCategory.classList.remove(className);
        })

        const modifier = categoryMap[value as keyof typeof categoryMap];
        if (modifier) {
            this.itemCategory.classList.add(modifier);
        }
    }

    set image(value: string) {
    const pngValue = value.replace(/\.svg$/, '.png');
    const fullUrl = `${CDN_URL}/${pngValue}`;
    this.setImage(this.itemImage, fullUrl, this.title);
    }
}

export class CardPreview extends CardCatalog<ICardPreview> {
    private itemButton: HTMLButtonElement;
    private inCart: boolean = false;
    private itemDescription: HTMLElement
    private priceValue: number | null = null;
    constructor(events: IEvents, container: HTMLElement, id: string) {
        super(events, container, id);

        this.itemButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.itemDescription = ensureElement<HTMLElement>('.card__text', this.container);

        
        this.itemButton.addEventListener('click', (event) => {
             event.stopPropagation();

            if (this.priceValue === null) return;

            if (this.inCart) {
                this.events.emit('card:delete', { id: this.id });
                
            } else {
                this.events.emit('card:add', { id: this.id });
            }

        });
    }

    set description (value: string) {
        this.itemDescription.textContent = value;
    }

    set price (value: number | null) {
        this.priceValue = value;
        super.price = value;
        this.changeButtonState();
    }

    set inCartStatus(value: boolean) {
        this.inCart = value;
        this.changeButtonState();
    }

    changeButtonState(): void {
        if (this.priceValue === null) {
            this.itemButton.textContent = 'Недоступно';
            this.itemButton.disabled = true;
            return;
        }

        this.itemButton.disabled = false;
        this.itemButton.textContent = this.inCart
            ? 'Удалить из корзины'
            : 'Купить';
    }
}