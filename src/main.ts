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
import { IProduct } from './types';

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

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new Order(cloneTemplate(orderTemplate), events);
const contactsForm = new Contacts(cloneTemplate(contactsTemplate), events);

events.on('items:changed', () => {
    page.render({
        catalog: catalogModel.getItems().map(item => {
            const card = new Card(cloneTemplate(cardCatalogTemplate), {
                onClick: () => {
                    catalogModel.setPreview(item);
                }
            });
            return card.render({
                title: item.title,
                image: CDN_URL + item.image,
                price: item.price,
                category: item.category
            });
        })
    });
});

events.on('preview:changed', (item: IProduct | null) => {
    if (item) {
        const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), {
            onClick: () => {
                if (basketModel.hasProduct(item.id)) {
                    basketModel.remove(item.id);
                } else {
                    basketModel.add(item);
                }
                modal.close();
            }
        });

        const isAdded = basketModel.hasProduct(item.id);

        modal.render({
            content: cardPreview.render({
                title: item.title,
                image: CDN_URL + item.image,
                price: item.price,
                category: item.category,
                text: item.description,
                buttonText: isAdded ? 'Удалить из корзины' : 'Купить'
            })
        });
    }
});

events.on('basket:changed', () => {
    page.render({ counter: basketModel.getCount() });
});

events.on('basket:open', () => {
    let index = 1;
    basketView.render({
        items: basketModel.getItems().map(item => {
            const cardBasket = new Card(cloneTemplate(cardBasketTemplate), {
                onClick: () => {
                    basketModel.remove(item.id);
                    let freshIndex = 1;
                    basketView.render({
                        items: basketModel.getItems().map(i => {
                            const cb = new Card(cloneTemplate(cardBasketTemplate), {
                                onClick: () => basketModel.remove(i.id)
                            });
                            return cb.render({ title: i.title, price: i.price, index: freshIndex++ });
                        }),
                        total: basketModel.getTotal()
                    });
                }
            });
            return cardBasket.render({
                title: item.title,
                price: item.price,
                index: index++
            });
        }),
        total: basketModel.getTotal()
    });
    modal.render({ content: basketView.render() });
});

events.on('order:open', () => {
    buyerModel.clear();
    modal.render({
        content: orderForm.render({
            address: '',
            payment: null,
            valid: false,
            errors: []
        })
    });
});

events.on(/^order\..*:change/, (data: { field: keyof typeof orderForm; value: string }) => {
    buyerModel.setField(data.field, data.value);
});

events.on('buyer:changed', (errors: Partial<Record<string, string>>) => {
    const isValid = Object.keys(errors).length === 0;
    orderForm.render({ valid: isValid, errors: Object.values(errors) });
    contactsForm.render({ valid: isValid, errors: Object.values(errors) });
});

events.on('order:submit', () => {
    modal.render({
        content: contactsForm.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
    });
});

events.on(/^contacts\..*:change/, (data: { field: keyof typeof contactsForm; value: string }) => {
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
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                }
            });

            basketModel.clear();
            buyerModel.clear();

            modal.render({
                content: success.render({
                    total: result.total
                })
            });
        })
        .catch((err) => {
            console.error('API Error:', err);
        });
});

events.on('modal:open', () => {
    page.render({ locked: true });
});

events.on('modal:close', () => {
    page.render({ locked: false });
});

larekApi.getProductsList()
    .then((response) => {
        catalogModel.setItems(response.items);
    })
    .catch((err) => {
        console.error('Init Error:', err);
    });


