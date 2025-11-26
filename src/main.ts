import './scss/styles.scss';
import {ProductList} from './components/Models/ProductList';
import { apiProducts } from './utils/data';
import {Cart} from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { ProductAPI } from './components/base/ProductAPI';
import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';

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
     
