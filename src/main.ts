import './scss/styles.scss';
import {ProductList} from './components/base/Models/ProductList'
import { apiProducts } from './utils/data'
import {Cart} from './components/base/Models/Cart'
import { Buyer } from './components/base/Models/Buyer';

// тестирую ProductList
const productsModel = new ProductList();
productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога: ', productsModel.getItems());

//Получение элемента
const element = productsModel.getItem(apiProducts.items[2].id)
console.log('Найденный элемент: ', element);

// Сохраняем товар
productsModel.setPreviewItem(apiProducts.items[0].id);

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


const buyer = new Buyer;





     
