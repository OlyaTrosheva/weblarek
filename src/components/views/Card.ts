import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

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

        this._title = this.ensureElement<HTMLElement>('.card__title');
        this._price = this.ensureElement<HTMLElement>('.card__price');
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
        this.setText(this._title, value);
    }

    set image(value: string) {
        if (this._image) {
            this.setImage(this._image, value, this.title);
        }
    }

    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
            const mappedClass = categoryMap[value] || 'other';
            this._category.className = `card__category card__category_${mappedClass}`;
        }
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
            if (this._button) {
                this.setDisabled(this._button, true);
                this.setText(this._button, 'Недоступно');
            }
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }

    set text(value: string) {
        if (this._text) {
            this.setText(this._text, value);
        }
    }

    set buttonText(value: string) {
        if (this._button && this._button.textContent !== 'Недоступно') {
            this.setText(this._button, value);
        }
    }

    set index(value: number) {
        if (this._index) {
            this.setText(this._index, String(value));
        }
    }

    render(data?: Partial<ICard>): HTMLElement {
        if (data) {
            Object.assign(this, data);
        }
        return this.container;
    }
}
