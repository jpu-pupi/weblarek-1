import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IGalery {
    items: HTMLElement[];
}

export class Gallery extends Component<IGalery> {
    private catalogElement: HTMLElement;

    constructor (container:HTMLElement) {
        super(container);
    
        this.catalogElement = ensureElement<HTMLElement>('.gallery')
    }

    set catalog(items:HTMLElement[]) {
        this.catalogElement.innerHTML = '';
        items.forEach(item => this.catalogElement.appendChild(item));
    }
}