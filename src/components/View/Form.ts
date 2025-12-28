import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IForm {
    error: string;
}

export class Form extends Component<IForm> {
    private formError: HTMLElement;
    private buttonSubmit: HTMLButtonElement;

    constructor (private events: IEvents, container: HTMLElement) {
        super(container);
        
        this.formError = ensureElement<HTMLElement>('.form__errors', this.container);
        this.buttonSubmit = ensureElement<HTMLButtonElement>('.button', this.container);

        this.buttonSubmit.addEventListener('click', () => {
            this.events.emit('order:submit');
        })
    }

        set error(value: string) {
            this.formError.textContent = value;
        }
}