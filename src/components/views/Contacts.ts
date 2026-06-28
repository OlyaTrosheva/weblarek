import { Form } from './Form';
import { IEvents } from '../base/events';

interface IContactsForm {
    email: string;
    phone: string;
}

export class Contacts extends Form<IContactsForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set email(value: string) {
        const emailInput = this.container.elements.namedItem('email') as HTMLInputElement;
        if (emailInput) {
            emailInput.value = value;
        }
    }

    set phone(value: string) {
        const phoneInput = this.container.elements.namedItem('phone') as HTMLInputElement;
        if (phoneInput) {
            phoneInput.value = value;
        }
    }
}

