import { IBuyer, TPayment, TBuyerErrors } from '../../types';
import { IEvents } from '../base/events';

export class BuyerModel implements IBuyer {
    payment: TPayment | null = null;
    address: string = '';
    phone: string = '';
    email: string = '';
    private events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setField(field: keyof IBuyer, value: string): void {
        if (field === 'payment') {
            this.payment = (value || null) as TPayment | null;
        } else if (field === 'address') {
            this.address = value;
        } else if (field === 'phone') {
            this.phone = value;
        } else if (field === 'email') {
            this.email = value;
        }
        this.events.emit('buyer:changed', this.validate());
    }

    getBuyerData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email
        };
    }

    clear(): void {
        this.payment = null;
        this.address = '';
        this.phone = '';
        this.email = '';
    }

    validate(): TBuyerErrors {
        const errors: TBuyerErrors = {};
        if (this.payment === null) errors.payment = 'Не выбран вид оплаты';
        if (!this.address.trim()) errors.address = 'Укажите адрес доставки';
        if (!this.email.trim()) errors.email = 'Укажите email';
        if (!this.phone.trim()) errors.phone = 'Укажите номер телефона';
        return errors;
    }
}
