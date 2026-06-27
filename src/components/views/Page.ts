import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this._counter = this.ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = this.ensureElement<HTMLElement>('.gallery');
        this._wrapper = this.ensureElement<HTMLElement>('.page__wrapper');
        this._basket = this.ensureElement<HTMLElement>('.header__basket');

        this._basket.addEventListener('click', () => {
            events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        this._wrapper.classList.toggle('page__wrapper_locked', value);
    }

    render(data?: Partial<IPage>): HTMLElement {
        if (data) {
            Object.assign(this, data);
        }
        return this.container;
    }
}
