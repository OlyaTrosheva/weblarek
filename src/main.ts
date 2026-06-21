import './scss/styles.scss'; 
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { LarekApi } from './components/models/LarekApi';
import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';

console.log('=== СТАРТ ЛОКАЛЬНОГО ТЕСТИРОВАНИЯ МОДЕЛЕЙ ===');

const productsModel = new CatalogModel();
productsModel.setItems(apiProducts.items); 
console.log('Массив товаров из каталога (локальный): ', productsModel.getItems());

const firstProduct = productsModel.getItems()[0];
if (firstProduct) {
    console.log('Получение одного товара по id: ', productsModel.getProduct(firstProduct.id));
    productsModel.setPreview(firstProduct);
    console.log('Получение товара для подробного отображения: ', productsModel.getPreview());
}

const basketModel = new BasketModel();
if (firstProduct) {
    basketModel.add(firstProduct);
    console.log('Проверка наличия товара в корзине по его id: ', basketModel.hasProduct(firstProduct.id));
    console.log('Получение количества товаров в корзине: ', basketModel.getCount());
    console.log('Получение стоимости всех товаров in корзине: ', basketModel.getTotal());
    console.log('Получение массива товаров, которые находятся в корзине: ', basketModel.getItems());
    basketModel.clear();

    console.log('Получение массива товаров после очистки корзины: ', basketModel.getItems());
}

const buyerModel = new BuyerModel();
console.log('Валидация данных (пустые данные): ', buyerModel.validate());
buyerModel.setField('address', 'ул. Ленина, д. 42');
buyerModel.setField('payment', 'card');
console.log('Получение всех данных покупателя (частично заполнено): ', buyerModel.getBuyerData());
console.log('Валидация данных (остались ошибки): ', buyerModel.validate());
buyerModel.clear();

console.log('=== КОНЕЦ ЛОКАЛЬНОГО ТЕСТИРОВАНИЯ ===');

console.log('=== ЗАПУСК СЕТЕВОГО ЗАПРОСА НА СЕРВЕР ===');
const baseApi = new Api(API_URL);
const larekApi = new LarekApi(baseApi);

larekApi.getProductsList()
    .then((serverResponse) => {
        productsModel.setItems(serverResponse.items);
        console.log('--- РЕЗУЛЬТАТ ЗАПРОСА К СЕРВЕРУ ---');
        console.log('Массив товаров из каталога (ЖИВЫЕ ДАННЫЕ С СЕРВЕРА): ', productsModel.getItems());
    })
    .catch((error) => {
        console.error('Ошибка при работе с сервером: ', error);
    });

