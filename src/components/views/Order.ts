import { Form } from './Form';
import { IEvents } from '../base/events';
import { TPayment } from '../../types';

interface IOrderForm {
    address: string;
    payment: TPayment | null;
}

export class Order extends Form<IOrderForm> {
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._cardButton = container.querySelector('.button_alt[name=card]') || container.querySelector('.button_alt:first-child') as HTMLButtonElement;
        this._cashButton = container.querySelector('.button_alt[name=cash]') || container.querySelector('.button_alt:last-of-type') as HTMLButtonElement;

        if (this._cardButton) {
            this._cardButton.addEventListener('click', () => {
                this.payment = 'card';
                this.onInputChange('payment', 'card');
            });
        }

        if (this._cashButton) {
            this._cashButton.addEventListener('click', () => {
                this.payment = 'cash';
                this.onInputChange('payment', 'cash');
            });
        }
    }

    set payment(value: TPayment | null) {
        if (this._cardButton && this._cashButton) {
            this._cardButton.classList.toggle('button_alt-active', value === 'card');
            this._cashButton.classList.toggle('button_alt-active', value === 'cash');
        }
    }

    set address(value: string) {
        const addressInput = this.container.elements.namedItem('address') as HTMLInputElement;
        if (addressInput) {
            addressInput.value = value;
        }
    }
}

