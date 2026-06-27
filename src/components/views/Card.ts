import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard extends IProduct {
    buttonText?: string;
    index?: number;
}

export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement;
    protected _price: HTMLElement;
    protected _text?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _index?: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._image = container.querySelector('.card__image') as HTMLImageElement || undefined;
        this._category = container.querySelector('.card__category') || undefined;
        this._text = container.querySelector('.card__text') || undefined;
        this._button = container.querySelector('.card__button') || undefined;
        this._index = container.querySelector('.basket__item-index') || undefined;

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this._title.textContent = value;
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

    set price(value: number | null) {
        if (value === null) {
            this._price.textContent = 'Бесценно';
            if (this._button) {
                this._button.disabled = true;
                this._button.textContent = 'Недоступно';
            }
        } else {
            this._price.textContent = `${value} синапсов`;
        }
    }

    set text(value: string) {
        if (this._text) {
            this._text.textContent = value;
        }
    }

    set buttonText(value: string) {
        if (this._button && this._button.textContent !== 'Недоступно') {
            this._button.textContent = value;
        }
    }

    set index(value: number) {
        if (this._index) {
            this._index.textContent = String(value);
        }
    }

    render(data?: Partial<ICard>): HTMLElement {
        if (data) {
            Object.assign(this, data);
        }
        return this.container;
    }
}

