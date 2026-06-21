import { IBuyer, TPayment, TFormErrors } from '../../types';

export class BuyerModel implements IBuyer {
    payment: TPayment = '';
    address: string = '';
    phone: string = '';
    email: string = '';

    setField(field: keyof IBuyer, value: string): void {
        if (field === 'payment') {
            this.payment = value as TPayment;
        } else {
            this[field] = value;
        }
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
        this.payment = '';
        this.address = '';
        this.phone = '';
        this.email = '';
    }

    validate(): TFormErrors {
        const errors: TFormErrors = {};
        if (!this.payment) errors.payment = 'Не выбран вид оплаты';
        if (!this.address.trim()) errors.address = 'Укажите адрес доставки';
        if (!this.email.trim()) errors.email = 'Укажите емэйл';
        if (!this.phone.trim()) errors.phone = 'Укажите номер телефона';
        return errors;
    }
}
