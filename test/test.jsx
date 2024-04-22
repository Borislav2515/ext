import { getElement, getElements } from './getElement';
import { createElementText, createElementBlock } from './createElement';
import { fillter_products, fillter_itog, tabulate, fillter_productsBonus } from './fillter_products';
import promocodes from '../promocodes.json';
import { updateProductCount, updatePageCount } from './updateProductCount.js';

// // webpack --config webpack.config.js
let data_items = [];
let productCards = [];

const btnStart_styles = {
    padding: '10px 5px 10px 15px',
    position: 'fixed',
    right: '0',
    top: '80%',
    cursor: 'pointer',
    backgroundColor: 'rgb(253 87 6)',
    color: 'white',
    borderRadius: '32px 0 0 32px',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    zIndex: '999',
};

const btnStop_styles_active = {
    backgroundColor: 'rgb(134 84 204)',
}

let btnStart = document.createElement('button');

// window.addEventListener('load', function() {
    
//     btnStart.classList.add('btnStart');
//     btnStart.innerText = 'Запустить';
//     Object.assign(btnStart.style, btnStart_styles);
//     document.querySelector('body').append(btnStart);
// })


// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     // Реагируем на сообщение об изменении URL
//     if (request.message === 'url-changed') {
//         btnStart.disabled = false;
//         btnStart.addEventListener('click', function() {
//             startApp()
//             console.log('Нажата кнопка "Запустить"');
//             btnStart.disabled = true;
//         })
//     }
// });


// window.addEventListener('load', function() {
//     startApp()
// })


// Функция, которая будет вызвана при появлении элемента
// const handleMutation = function(mutationsList, observer) {
//     for (const mutation of mutationsList) {
//         if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
//             // Проверяем появление нужного элемента
//             const targetElement = document.querySelector('.catalog-items-list > div:first-child .catalog-item-photo img:first-child');
//             if (targetElement) {
//                 console.log(document.querySelector('.catalog-items-list > div:first-child .catalog-item-photo img:first-child'))
//                 // Запускаем функцию startApp()
//                 startApp();
//                 console.log('Функция startApp() запущена.');
//                 deactivateObserver()
//                 return;
//             }
//         }
//     }
// };

// // Наблюдатель за изменениями DOM
// const observer = new MutationObserver(handleMutation);

// // Настройки для наблюдателя (следим за добавлением узлов)
// const observerConfig = { childList: true, subtree: true };

// // Флаг, указывающий, активен ли наблюдатель в данный момент
// let observerActive = false;

// // Функция для включения наблюдателя
// function activateObserver() {
//     if (!observerActive) {
//         observer.observe(document.body, observerConfig);
//         observerActive = true;
//     }
// }

// // Функция для отключения наблюдателя
// function deactivateObserver() {
//     if (observerActive) {
//         observer.disconnect();
//         observerActive = false;
//     }
// }

// // Включаем наблюдатель при запуске скрипта
// activateObserver();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request)
        if (request.message === 'url-changed') {
            console.log('chrome ', request.message === 'url-changed');
            startApp();
        }
});



function startApp() {
        // Очищаем данные и удаляем старые элементы интерфейса
        data_items = [];
        productCards = [];

        const table_parent = getElement('.catalog-listing-controls');
        const existingTable = document.querySelector('.ext-table');

        if (existingTable) {
            existingTable.remove();
        }        

        setTimeout(() => {
            productCards = Array.from(document.querySelectorAll('.catalog-item:not(.catalog-item_out-of-stock):not(.catalog-item_banner):not(.catalog-item_banner'));
            const table_parent = getElement('.catalog-listing-controls');
            const table_parent__content = createElementBlock('div', 'table_parent__content');
            const buttonShow_wrap = createElementBlock('div', 'buttonShow_wrap');
            let count_products = createElementBlock('span', 'ext-count_products');
            let count_page = createElementBlock('span', 'ext-count_page');
            const tabulate_data_btn = createElementText('button', 'ext-button', 'Открыть таблицу');
            const button_all_show = createElementText('button', 'ext-button', 'Автозагрузка товаров');
            const promocode_wrap = createElementBlock('div', 'promocode_wrap');
    
    
            const root = createElementBlock('div', 'css__content');
            const cssUrl = chrome.runtime.getURL('style.css');
            root.innerHTML = `<link rel="stylesheet" href="${cssUrl}">`;
    
            if (!table_parent) {
                return;
            } else {
                table_parent.appendChild(root);
            }
    
            // Обновляем количество товаров после загрузки новых карточек
            count_products.innerText = updateProductCount(productCards)
            
            // Обновляем текущую страницу товара после загрузки новых карточек
            if (count_page) {
                count_page.innerText = updatePageCount();
            }
    
            table_parent.appendChild(table_parent__content);
            table_parent__content.appendChild(buttonShow_wrap);
            buttonShow_wrap.appendChild(tabulate_data_btn);
            buttonShow_wrap.appendChild(count_page);
            buttonShow_wrap.appendChild(button_all_show);
            buttonShow_wrap.appendChild(count_products);
        
    
            const table = document.createElement('table');
            table.classList.add('ext-table');
            table_parent.appendChild(table);
            const thead = document.createElement('thead');
            const tr = document.createElement('tr');
            thead.appendChild(tr);
    
            table.appendChild(thead);
            const tbody = document.createElement('tbody');
            table.appendChild(tbody);
    
            const tableTitle = [{name:'Название', atr: 'name'}, {name: 'Магазин', atr:"shop"}, {name: 'Цена', atr:"price"}, {name: 'Бонусы %', atr:"bonus"}, {name: 'Итого', atr:"total"}];
            tableTitle.forEach((item) => {
                const td = createElementBlock('td', 'ext-td');
                const tableTitle_a = createElementText('a', 'ext-td-link', item.name);
                tableTitle_a.href = '#';
                td.appendChild(tableTitle_a);
                tr.appendChild(td);
                tableTitle_a.addEventListener('click', (event) => {
                    event.preventDefault();
                    if (item.atr === 'name') {
                        fillter_products(data_items, tbody, 'name' )
                    } else if (item.atr === 'shop') {
                        fillter_products(data_items, tbody, 'shop')
                    } else if(item.atr === 'price') {
                        fillter_products(data_items, tbody, 'price')
                    } else if(item.atr === 'bonus') {
                        fillter_productsBonus(data_items, tbody, 'bonus')
                    } else if(item.atr === 'total') {
                        fillter_products(data_items, tbody, 'total')
                    } 
                })
            })
    
            let buttonShow = createElementText('button', 'ext-button', 'Загрузить еще товары');
            buttonShow_wrap.appendChild(buttonShow);
    
            tabulate_data_btn.addEventListener('click', () => {
                table.classList.toggle('active');
                if (table.classList.contains('active')) {
                    tabulate_data_btn.innerText = 'Скрыть таблицу';
                } else {
                    tabulate_data_btn.innerText = 'Открыть таблицу';
                }
    
                setTimeout(() => {
                    parsingData();
                    count_products.innerText = updateProductCount(productCards);
                    tabulate(data_items, tbody);
                }, 500); // Задержка в 500 миллисекунд
            });
    
            buttonShow.addEventListener('click', () => {
                const btnMoreProduct = document.querySelector('.catalog-items-list__show-more');
            
                if (!btnMoreProduct) {
                    buttonShow.disabled = true;
                    buttonShow.classList.add('disabled');
                    return;
                }
            
                btnMoreProduct.click();
                setTimeout(() => {
                    parsingData();
                    tabulate(data_items, tbody);
                }, 500); // Задержка в 500 миллисекунд
            });
    
            button_all_show.addEventListener('click', () => {
                let btnMoreProduct = document.querySelector('.catalog-items-list__show-more');
    
                if (!btnMoreProduct) {
                    buttonShow.disabled = true;
                    buttonShow.classList.add('disabled');
                } else {
                    loadMoreProducts();
                    setTimeout(() => {
                        parsingData();
                        count_products.innerText = 'Количество товаров: ' + productCards.length;
                        let params = (new URL(document.location)); 
                        params = params.href;
                        const match = params.match(/page-(\d+)/);
                        if (match) {
                            count_page.innerHTML = '';
    
                            if (match) {
                            count_page.innerText = 'Текущая страница: ' + match[1];
                            } else {
                                count_page.innerText = 'Текущая страница: 1';
                            }
                        }
                        tabulate(data_items, tbody);
                    }, 500); // Задержка в 500 миллисекунд
                }
            })
    
            // Функция для нажатия на кнопку пагинации и подгрузки новых товаров
            var totalPagesLoaded = 0; // Переменная для отслеживания количества загруженных страниц
            var paginationInterval; // Переменная для хранения интервала, который будет останавливать загрузку
    
            function loadMoreProducts() {
                // Найдите кнопку пагинации на вашей странице (замените 'pagination-button' на реальный id или класс кнопки)
                var paginationButton = document.querySelector('.catalog-items-list__show-more');
                parsingData();
                count_products.innerText = updateProductCount(productCards);
                tabulate(data_items, tbody);
                
                // Если кнопка пагинации присутствует на странице
                if (paginationButton) {
                    // Нажмите на кнопку
                    paginationButton.click();
                    
                    // Увеличиваем счетчик загруженных страниц
                    totalPagesLoaded++;
    
                    let params = (new URL(document.location)); 
                    params = params.href;
                    const match = params.match(/page-(\d+)/);
                    if (match) {
                        count_page.innerHTML = '';
                        if (count_page) {
                            count_page.innerText = updatePageCount();
                        }
                    }
                    
                    // Добавьте задержку перед следующим нажатием (в миллисекундах)
                    var delay = 3000; // Например, 3 секунды
                    
                    // Подождите перед следующим нажатием
                    paginationInterval = setTimeout(function() {
                        loadMoreProducts();
                    }, delay);
                }
            }
      
            function parsingData() {
                productCards = Array.from(document.querySelectorAll('.catalog-item:not(.catalog-item_out-of-stock):not(.catalog-item_banner):not(.catalog-item_banner'));
                productCards.forEach((card) => {
                    let productID = card.id;
            
                    // Проверяем, есть ли уже такой идентификатор товара в массиве
                    const exists = data_items.some(item => item.id === productID);
                    if (!exists) {
                        let name = card.querySelector('.item-title > a');
                        name = removeExtraCharacters(name.innerText);
            
                        let namelink = card.querySelector('.item-title > a');
                        namelink = namelink.href;
            
                        let shop = card.querySelector('.merchant-info__name');
                        if(shop) {
                            shop = shop.innerText;
                        } else {
                            shop = 'Неизвестен';
                        }
            
                        let shopLink = card.querySelector('.catalog-item__merchant-info');
                        if(shopLink) {
                            shopLink = shopLink.href;
                        } else {
                            shopLink = 'Неизвестен';
                        }
                        
            
                        let price = card.querySelector('.item-price > span');
                        // price = removeExtraCharacters(price.innerText);
                        price = price.innerText;
                        price = parseInt(price.replace(/[^\d]/g, '').trim());
            
                        let bonus = card.querySelector('.bonus-percent');
                        let bonusPercent = bonus.innerText;
                        // bonusPercent = removeExtraCharacters(bonusPercent);
                        bonusPercent = parseInt(bonusPercent);
                        
                        let bonusValue = card.querySelector('.bonus-amount');
            
                        const total = calculateTotal(price, bonusPercent);
            
                        let totalItog = calculateTotal(price, bonusPercent)
            
                        // Пример добавления объекта товара в массив
                        data_items.push({
                            id: productID,
                            name: name,
                            namelink: namelink,
                            shop: shop,
                            shopLink: shopLink,
                            price: price,
                            bonus: bonusPercent,
                            bonusValue: bonusValue,
                            total: total,
                            totalItog: totalItog
                        });
                    }
                });
                
                if (!productCards) {
                    return console.log('Карточек нет');
                }
    
                if (count_page) {
                    count_page.innerText = updatePageCount();
                }
    
                if (count_products) {
                    count_products.innerText = updateProductCount(productCards);
                }
            }
    
            function removeExtraCharacters(inputString) {
                // Используем регулярное выражение для удаления символов процентов и рубля
                if(!inputString) {
                    return 0;
                }
                return inputString.replace(/[%\u20BD]/g, '');
            }
    
            function calculateTotal (price, bonus) {
                if (!price || !bonus) {
                    return 0;
                }
                let cleanPrice = price;
                let cleanBonus = parseFloat(bonus);
                cleanPrice = parseInt(cleanPrice);
                cleanBonus = parseInt(cleanBonus);
                let bonusValue = cleanPrice * cleanBonus / 100;
                bonusValue = Math.ceil(bonusValue);
                let total = cleanPrice - bonusValue;
                return total;
            };

        }, "5000");
}
