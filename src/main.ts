import './scss/styles.scss';
import { IProduct } from './types';
import {ProductList} from './components/Models/ProductList';
import {Cart} from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';

import { ProductAPI } from './components/base/ProductAPI';
import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';

import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
import { Modal } from './components/View/Modal';
import { CartView } from './components/View/CartView';

import { CardCatalog } from './components/View/Card';
import { CardPreview } from './components/View/Card';
import { CardBasket } from './components/View/Card';

import { OrderForm, IOrderForm } from './components/View/Form';
import { ContactsForm, IContactsForm} from './components/View/Form';

import { Success } from './components/View/Success';

const api = new Api (API_URL); 
const product = new ProductAPI(api);
const events = new EventEmitter();
const productList = new ProductList(events);
const buyer = new Buyer(events);

const galleryElement = document.querySelector('.gallery') as HTMLElement;
if (!galleryElement) {
    throw new Error('Не найден элемент .gallery');
}

const galleryList = new Gallery(galleryElement);

const modalElement = document.querySelector('#modal-container') as HTMLElement;
const modal = new Modal(modalElement);

const cart = new Cart(events);
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basketElement = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const cartView = new CartView(events, basketElement);
cartView.orderButtonDisabled = cart.getItems().length === 0;

const headerElement = document.querySelector('.header') as HTMLElement;
const header = new Header(events, headerElement);

const orderFormTemplate = document.querySelector('#order') as HTMLTemplateElement;
const orderFormElement = orderFormTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const orderForm = new OrderForm(events, orderFormElement);

const contactsFormTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const contactsFormElement = contactsFormTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const contactsForm = new ContactsForm(events, contactsFormElement);

const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
const successElement = successTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const success = new Success(events, successElement);

product.getProductList()
    .then(products => {
        productList.setItems(products);
        console.log('Товары загружены:', productList.getItems());
    })
    .catch(error => console.error('Ошибка:', error));


events.on<IProduct[]>('productList:changed', (items) => {
    const cards = items.map(item => {
        const template = document.querySelector('#card-catalog') as HTMLTemplateElement;
        const cardElement = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

        const card = new CardCatalog(events, cardElement, item.id);
        card.render(item);

        return cardElement;
    });

    galleryList.catalog = cards;
});

events.on<{ id: string }>('card:select', ({id}) =>{
    const product = productList.getItem(id);
    if (!product) return;

    const template = document.querySelector('#card-preview') as HTMLTemplateElement;

    const previewElement = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const cardPreview = new CardPreview(events, previewElement, product.id);

    cardPreview.render(product);
    cardPreview.price = product.price;
    cardPreview.inCartStatus = cart.inCart(product.id);

    modal.content = previewElement;
    modal.open();
});

 events.on<{ id: string}>('card:add', ({id}) => {
    const product = productList.getItem(id);
    if (!product) return;

    cart.addItem(product);
 });

 events.on<{ id: string}>('card:delete', ({id}) => {
    const product = productList.getItem(id);
    if (!product) return;

    cart.deleteItem(product);
 });

 events.on<IProduct[]>('cart:changed', (items) => {
    cartView.orderButtonDisabled = items.length === 0;

    const cardElements = items.map((item, index) => {
        const template = document.querySelector('#card-basket') as HTMLTemplateElement;
        const cardElement = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

        const cardBasket = new CardBasket(events, cardElement, item.id);
        cardBasket.render({ title: item.title, price: item.price, index: index + 1 });

        return cardElement;
    });

    cartView.items = cardElements;
    cartView.total = cart.getTotalPrice();
    header.counter = items.length;
 });

 events.on('basket:open', () => {
    modal.content = basketElement;
    modal.open();
 });

 events.on('basket:checkout', () => {
    modal.content = orderFormElement;
    modal.open();
 })

 events.on<IOrderForm>('order:validate', (data) => {
    buyer.setPayment(data.payment);
    buyer.setAddress(data.address);

    const errors = buyer.validateStep1();

     if (Object.keys(errors).length > 0) {
        orderForm.showError(errors.payment || errors.address || '');
        orderForm.submitButton.disabled = true;
    } else {
        orderForm.clearError();
        orderForm.submitButton.disabled = false;
    }

 });

 events.on('order:checkout', () => {
    modal.content = contactsFormElement;
    modal.open();
 })

 events.on<IContactsForm>('contacts:validate', (data) => {
    buyer.setEmail(data.email);
    buyer.setPhone(data.phone);

     const errors = buyer.validateStep2();

    if (Object.keys(errors).length > 0) {
        contactsForm.showError(errors.email || errors.phone || '');
        contactsForm.submitButton.disabled = true;
    } else {
        contactsForm.clearError();
        contactsForm.submitButton.disabled = false;
    }
 });

 events.on<IContactsForm>('contacts:checkout', async () => {
    
    const errors = buyer.validateStep2();

    if (Object.keys(errors).length > 0) {
        contactsForm.showError(errors.email || errors.phone || '');
        return;
    }

    const orderData = buyer.getDataOrder(cart.getItems());

    try {
        await product.submitOrder(orderData);

        const totalPrice = cart.getTotalPrice()

        cart.clear();
        cartView.items = [];
        cartView.total = 0;
        cartView.orderButtonDisabled = true;
        header.counter = 0;
        buyer.clear();

        modal.content = successElement;
        modal.open();
        success.total = totalPrice;

    } catch (err: any) {
        contactsForm.showError('Ошибка при оплате: ' + (err.message || 'неизвестная ошибка'));
    } 
 })

 events.on('modal:close', () => {
    modal.close();
 })


 

