import { Form } from './Form';
import { IEvents } from '../base/events';
import { TPayment } from '../../types';
import { ensureElement } from '../../utils/utils';


interface IOrderForm {
    address: string;
    payment: TPayment;
}

export class Order extends Form<IOrderForm> {
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._cardButton = ensureElement<HTMLButtonElement>('button[name=card]', container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name=cash]', container);


        this._cardButton.addEventListener('click', () => {
            this.onInputChange('payment', 'card');
        });

        this._cashButton.addEventListener('click', () => {
            this.onInputChange('payment', 'cash');
        });
    }

    set payment(value: TPayment) {
        this._cardButton.classList.toggle('button_alt-active', value === 'card');
        this._cashButton.classList.toggle('button_alt-active', value === 'cash');
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}
