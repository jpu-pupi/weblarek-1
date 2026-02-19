import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    private modalCloseButton: HTMLButtonElement;
    private modalContent: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.modalCloseButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.modalContent = ensureElement<HTMLElement>('.modal__content', this.container);

        this.modalCloseButton.addEventListener('click', () => {
            this.close();
    });
        this.container.addEventListener('click', (event)=> {
            if (event.target === this.container) {
                this.close();
            }
        });
    }

    set content (value: HTMLElement) {
        this.modalContent.innerHTML = '';
        this.modalContent.appendChild(value);
    }

    open(): void {
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
    }

}