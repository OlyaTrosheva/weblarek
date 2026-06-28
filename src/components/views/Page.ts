import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

interface IPage {
    counter: number;
    locked: boolean;
}

export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _basket: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this._counter = ensureElement<HTMLElement>('.header__basket-counter', container);
        this._basket = ensureElement<HTMLElement>('.header__basket', container);

        this._basket.addEventListener('click', () => {
            events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this._counter.textContent = String(value);
    }

    set locked(value: boolean) {
        if (value) {
            document.body.classList.add('page_locked');
        } else {
            document.body.classList.remove('page_locked');
        }
    }
}

