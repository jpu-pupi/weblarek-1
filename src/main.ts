import './scss/styles.scss';
import {ProductList} from './components/Models/ProductList';
import { apiProducts } from './utils/data';
import {Cart} from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { ProductAPI } from './components/base/ProductAPI';
import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
import { Modal } from './components/View/modal';

// тестирую ProductList
const productsModel = new ProductList();
productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога: ', productsModel.getItems());

//Получение элемента
const element = productsModel.getItem(apiProducts.items[2].id)
console.log('Найденный элемент: ', element);

// Сохраняем товар
productsModel.setPreviewItem(apiProducts.items[0]);

// Получаем сохраненный товар
console.log('Получили сохраненный товар: ', productsModel.getPreviewItem());

// тестирую Cart
const cartModel = new Cart();

//Добавила все товары в корзину
apiProducts.items.forEach(item => {
    cartModel.addItem(item)
});

// Удаляю товар
cartModel.deleteItem(apiProducts.items[2]); // Удалила товар

// Получаю список товаров
console.log('Текущий спикок товаров: ', cartModel.getItems());

console.log('Общая сумма: ', cartModel.getTotalPrice());
console.log('Общее количество товаров в корзине: ', cartModel.getTotalQuantity());

console.log('Товар в корзине? ', cartModel.inCart(apiProducts.items[2].id)) // false тк этот товар удален

cartModel.clear(); //Очистила корзину
console.log(cartModel.getItems()); //Должен вернуться пустой массив


const buyer = new Buyer();

// Проверка начального состояния
console.log('Начальное состояние:', buyer.getData());
// Должно быть: { payment: '', email: '', phone: '', address: '' }

//Заполнение данных
buyer.setPayment('card');
buyer.setEmail('test@mail.ru');
buyer.setPhone('+79991234567');
buyer.setAddress('Москва');

console.log('После заполнения:', buyer.getData());

//Валидация первого шага
const step1Errors = buyer.validateStep1();
console.log('Ошибки шага 1:', step1Errors);
// Должно быть: {} (пустой объект, так как все заполнено)

//Валидация второго шага  
const step2Errors = buyer.validateStep2();
console.log('Ошибки шага 2:', step2Errors);
// Должно быть: {} (пустой объект)

// Очистка
buyer.clear();
console.log('После очистки:', buyer.getData());
// Должно быть снова пусто



// Тест ошибок
const buyer2 = new Buyer();

// Не заполняем данные
console.log('Ошибки шага 1 (пустые данные):', buyer2.validateStep1());
// Должно быть: { payment: 'Не выбран способ оплаты', address: 'Введите адрес доставки' }

// Заполняем только первый шаг
buyer2.setPayment('cash');
buyer2.setAddress('СПб');
console.log('Ошибки шага 2 (email и phone пустые):', buyer2.validateStep2());
// Должно быть: { email: 'Введите email', phone: 'Введите телефон' }

const api = new Api (API_URL); 
const productAPI = new ProductAPI(api);
const productList = new ProductList();

productAPI.getProductList()
    .then(products => {
        productList.setItems(products);
        console.log('Товары загружены:', productList.getItems());
    })
    .catch(error => console.error('Ошибка:', error));

//Тестирую Header
 const headerContainer = document.querySelector('.header') as HTMLElement;

 const events = new EventEmitter();

 const header = new Header (events, headerContainer);
 console.log('Header создан:', header);
 header.counter = 6;

 console.log(header.render());

 //Тестирую Gallery
// Найти элемент с классом gallery
const galleryElement = document.querySelector('main') as HTMLElement;

// Найти шаблон
const template = document.getElementById('card-catalog') as HTMLTemplateElement;

// Клонировать содержимое шаблона
const cardFragment = template.content.cloneNode(true) as DocumentFragment;
const cardElement = cardFragment.firstElementChild as HTMLElement;

// Создать экземпляр Gallery и передать карточку
const gallery = new Gallery(galleryElement);
gallery.catalog = [cardElement];

console.log(gallery.render());

//Тестирую Modal

const events1 = new EventEmitter();
const modalElement = document.getElementById('modal-container') as HTMLElement;
const modal = new Modal(events1, modalElement);

modal.content = cardElement;
modal.open();
