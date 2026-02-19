import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { TPayment } from "../../types";

interface IForm {
    error: string;
}

export interface IOrderForm extends IForm {
    payment: TPayment;
    address: string;
}

export interface IContactsForm extends IForm {
    email: string;
    phone: string;
}

export abstract class Form<T extends IForm = IForm> extends Component<T> {
    submitButton: HTMLButtonElement;
    protected errorSpan: HTMLElement;
    protected events: IEvents;

    constructor (events: IEvents, container: HTMLElement) {
        super(container);
        this.events = events;

        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container)
        this.errorSpan = ensureElement<HTMLElement>('.form__errors', this.container);
    }

    showError(message: string) {
        this.errorSpan.textContent = message;
        this.errorSpan.style.display = 'block';
    }

    clearError() {
        this.errorSpan.textContent = '';
        this.errorSpan.style.display = 'none';
    }
}

export class OrderForm extends Form<IOrderForm> {
    private buttonCard: HTMLButtonElement;
    private buttonCash: HTMLButtonElement;
    private inputAddress: HTMLInputElement;

    private selectedPayment: TPayment | null = null;

    constructor(events: IEvents, container:HTMLElement) {
        super(events, container);

        this.buttonCard = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.buttonCash = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.inputAddress =ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        this.inputAddress.addEventListener('input', () => {
            this.updateFormState();
        });

        this.buttonCard.addEventListener('click', () => {
            this.selectedPayment = 'card';
            this.updatePaymentUI()
            this.updateFormState();
        });

        this.buttonCash.addEventListener('click', () => {
            this.selectedPayment = 'cash';
            this.updatePaymentUI()
            this.updateFormState();
        });

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();

            this.events.emit('order:checkout', this.getFormData());
        });
    }

    updatePaymentUI() {
        this.buttonCard.classList.toggle(
            'button_alt-active',
            this.selectedPayment === 'card'
        );

        this.buttonCash.classList.toggle(
            'button_alt-active',
            this.selectedPayment === 'cash'
        )
    }

    getFormData(): IOrderForm {
        return {
            error: this.errorSpan.textContent ?? '',
            payment: this.selectedPayment ?? '',
            address: this.inputAddress.value,
        };
    }

    updateFormState() {
    const data = this.getFormData();

    this.events.emit('order:validate', data);
}
}

export class ContactsForm extends Form<IContactsForm> {
    private inputEmail: HTMLInputElement;
    private inputPhone: HTMLInputElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);

        this.inputEmail = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.inputPhone = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        const updateButton = () => {
            const filled = this.inputEmail.value.trim() !== '' && this.inputPhone.value.trim() !== '';
            this.submitButton.disabled = !filled;
        };

        this.inputEmail.addEventListener('input',() => {
            updateButton();
            this.updateFormState();
        });
        this.inputPhone.addEventListener('input', () => {
            updateButton();
            this.updateFormState();
        });

        updateButton();

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();

            this.events.emit('contacts:checkout', this.getFormData());
        });
    }

    updateFormState() {
    this.events.emit('contacts:validate', this.getFormData());
}

    getFormData(): IContactsForm {
        return {
            error: this.errorSpan.textContent ?? '',
            email: this.inputEmail.value.trim(),
            phone: this.inputPhone.value.trim(),
        };
    }
}