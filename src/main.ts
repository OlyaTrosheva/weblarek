import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/models/LarekApi';
import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';

import { Page } from './components/views/Page';
import { Card } from './components/views/Card';
import { Modal } from './components/views/Modal';
import { Basket } from './components/views/Basket';
import { Order } from './components/views/Order';
import { Contacts } from './components/views/Contacts';
import { Success } from './components/views/Success';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

interface IOrderChange {
    field: 'address' | 'payment';
    value: string;
}

interface IContactsChange {
    field: 'email' | 'phone';
    value: string;
}

interface ICardEvent {
    id: string;
}

const events = new EventEmitter();
const baseApi = new Api(API_URL);
const larekApi = new LarekApi(baseApi);

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const catalogContainer = ensureElement<HTMLElement>('.gallery');

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new Order(cloneTemplate(orderTemplate), events);
const contactsForm = new Contacts(cloneTemplate(contactsTemplate), events);

const successForm = new Success(cloneTemplate(successTemplate), {
    onClick: () => {
        modal.close();
    }
});

events.on('items:changed', () => {
    const cards = catalogModel.getItems().map(item => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), events);
        return card.render({
            id: item.id,
            title: item.title,
            image: CDN_URL + item.image,
            price: item.price,
            category: item.category
        });
    });
    catalogContainer.replaceChildren(...cards);
});

events.on('card:select', (data: ICardEvent) => {
    catalogModel.setPreview(data.id);
});

events.on('preview:changed', () => {
    const product = catalogModel.getPreview();
    if (product) {
        const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), events);

        const isAdded = basketModel.hasProduct(product.id);
        const isPriceNull = product.price === null;
        const buttonText = isPriceNull ? 'Недоступно' : (isAdded ? 'Удалить из корзины' : 'Купить');

        modal.render({
            content: cardPreview.render({
                id: product.id,
                title: product.title,
                image: CDN_URL + product.image,
                price: product.price,
                category: product.category,
                text: product.description,
                buttonText: buttonText,
                buttonDisabled: isPriceNull
            })
        });
        modal.open();
    }
});

events.on('card:toggle-basket', (data: ICardEvent) => {
    const product = catalogModel.getProduct(data.id);
    if (product) {
        if (basketModel.hasProduct(product.id)) {
            basketModel.remove(product.id);
        } else {
            basketModel.add(product);
        }
        modal.close();
    }
});

events.on('basket:changed', () => {
    page.render({ counter: basketModel.getCount() });
    
    let index = 1;
    basketView.render({
        items: basketModel.getItems().map(basketItem => {
            const cardBasket = new Card(cloneTemplate(cardBasketTemplate), events);
            return cardBasket.render({
                id: basketItem.id,
                title: basketItem.title,
                price: basketItem.price,
                index: index++
            });
        }),
        total: basketModel.getTotal()
    });
});

events.on('basket:delete', (data: ICardEvent) => {
    basketModel.remove(data.id);
});

events.on('basket:open', () => {
    modal.render({ content: basketView.render() });
    modal.open();
});

events.on('order:open', () => {
    buyerModel.clear();
    buyerModel.setField('payment', 'card');
    
    modal.render({
        content: orderForm.render(Object.assign({
            address: buyerModel.address,
            payment: buyerModel.payment,
            valid: false,
            errors: ''
        }))
    });
    modal.open();
});

events.on(/^order\..*:change/, (data: IOrderChange) => {
    buyerModel.setField(data.field, data.value);
});

events.on('buyer:changed', () => {
    const buyerErrors = buyerModel.validate();
    
    const orderErrors: string[] = [];
    if (buyerErrors.payment) orderErrors.push(buyerErrors.payment);
    if (buyerErrors.address) orderErrors.push(buyerErrors.address);
    
    orderForm.render(Object.assign({ 
        address: buyerModel.address,
        payment: buyerModel.payment,
        valid: orderErrors.length === 0, 
        errors: orderErrors.join(', ')
    }));

    const contactsErrors: string[] = [];
    if (buyerErrors.email) contactsErrors.push(buyerErrors.email);
    if (buyerErrors.phone) contactsErrors.push(buyerErrors.phone);
    
    contactsForm.render(Object.assign({ 
        email: buyerModel.email,
        phone: buyerModel.phone,
        valid: contactsErrors.length === 0, 
        errors: contactsErrors.join(', ')
    }));
});

events.on('order:submit', () => {
    modal.render({
        content: contactsForm.render(Object.assign({
            email: buyerModel.email,
            phone: buyerModel.phone,
            valid: false,
            errors: ''
        }))
    });
    modal.open();
});

events.on(/^contacts\..*:change/, (data: IContactsChange) => {
    buyerModel.setField(data.field, data.value);
});

events.on('contacts:submit', () => {
    const orderData = {
        ...buyerModel.getBuyerData(),
        total: basketModel.getTotal(),
        items: basketModel.getItems().map(item => item.id)
    };

    larekApi.postOrder(orderData)
        .then((result) => {
            basketModel.clear();
            buyerModel.clear();

            modal.render({
                content: successForm.render({
                    total: result.total
                })
            });
            modal.open();
        })
        .catch((err) => {
            console.error('API Error:', err);
        });
});

larekApi.getProductsList()
    .then((response) => {
        catalogModel.setItems(response.items);
    })
    .catch((err) => {
        console.error('Init Error:', err);
    });



