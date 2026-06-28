import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

        this._button.addEventListener('click', () => {
            events.emit('order:open');
        });
    }

    set items(items: HTMLElement[]) {
        this._list.replaceChildren(...items);
        this._button.disabled = items.length === 0;
    }

    set total(total: number) {
        this._total.textContent = `${total} синапсов`;
    }
}

