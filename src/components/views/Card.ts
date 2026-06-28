import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export interface ICard extends IProduct {
    buttonText?: string;
    index?: number;
    buttonDisabled?: boolean;
    text?: string;
}

export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    public _image?: HTMLImageElement;
    public _category?: HTMLElement;
    public _text?: HTMLElement;
    public _button?: HTMLButtonElement;
    public _index?: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._image = container.querySelector('.card__image') as HTMLImageElement;
        this._category = container.querySelector('.card__category') as HTMLElement;
        this._text = container.querySelector('.card__text') as HTMLElement;
        this._button = container.querySelector('.card__button') as HTMLButtonElement;
        this._index = container.querySelector('.basket__item-index') as HTMLElement;

        const deleteButton = container.querySelector('.basket__item-delete');

        if (this._button) {
            this._button.addEventListener('click', (e) => {
                e.stopPropagation();
                events.emit('card:toggle-basket', { id: this.id });
            });
        } else if (deleteButton) {
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                events.emit('basket:delete', { id: this.id });
            });
        } else {
            container.addEventListener('click', () => {
                events.emit('card:select', { id: this.id });
            });
        }
    }

    set id(value: string) {
        this.container.setAttribute('data-id', value);
    }

    get id(): string {
        return this.container.getAttribute('data-id') || '';
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number | null) {
        this._price.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
    }

    set image(value: string) {
        if (this._image) {
            this._image.src = value;
            this._image.alt = this._title.textContent || '';
        }
    }

    set category(value: string) {
        if (this._category) {
            this._category.textContent = value;
            const mappedClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
            this._category.className = `card__category ${mappedClass}`;
        }
    }

    set text(value: string) {
        if (this._text) {
            this._text.textContent = value;
        }
    }

    set buttonText(value: string) {
        if (this._button) {
            this._button.textContent = value;
        }
    }

    set buttonDisabled(value: boolean) {
        if (this._button) {
            this._button.disabled = value;
        }
    }

    set index(value: number) {
        if (this._index) {
            this._index.textContent = String(value);
        }
    }
}



