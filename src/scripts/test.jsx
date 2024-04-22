'use strict';

import { getElement } from './getElement';
import { createElementBlock, createCheckbox } from './createElement';
import { filterProducts, tabulate, filterProductsBonus } from './fillter_products';
import { updateProductCount } from './updateProductCount.js';
import { calculateTotal } from './calculateTotal.js';
import { getBestDiscount } from './getBestDiscount.js';
import { openTable } from './btnFunction.js';
import { createPromocodeList, asd } from './createPromocodeList.js';

// webpack --config webpack.config.js
let data_items = [];
let productCards = [];

const btnStart_styles = {
    padding: '10px 5px 10px 15px',
    position: 'fixed',
    right: '0',
    top: '80%',
    cursor: 'pointer',
    backgroundColor: 'grey',
    color: 'white',
    borderRadius: '32px 0 0 32px',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    zIndex: '999',
};

const btnStop_styles_active = {
    backgroundColor: '#8654cc',
};

const btnStart = createElementBlock('button', 'btnStart', 'Запустить');
Object.assign(btnStart.style, btnStart_styles);

// Функция, которая будет вызвана при появлении элемента
const handleMutation = function(mutationsList, observer) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Проверяем появление нужного элемента
            const targetElement = document.querySelector('.catalog-items-list > div:first-child .catalog-item-photo img:first-child');
            if (targetElement) {
                Object.assign(btnStart.style, btnStop_styles_active);
                btnStart.disabled = false;
                deactivateObserver();
                return;
            } else {
                Object.assign(btnStart.style, btnStart_styles);
            }
        }
    }
};

btnStart.addEventListener('click', function() {
    const targetElement = document.querySelector('.catalog-items-list > div:first-child .catalog-item-photo img:first-child');
    if (targetElement) {
        startApp();
        btnStart.disabled = true;
        promocodes = [];
    }
});

// Наблюдатель за изменениями DOM
const observer = new MutationObserver(handleMutation);

// Настройки для наблюдателя (следим за добавлением узлов)
const observerConfig = { childList: true, subtree: true };

// Флаг, указывающий, активен ли наблюдатель в данный момент
let observerActive = false;

function activateObserver() {
    if (!observerActive) {
        observer.observe(document.body, observerConfig);
        observerActive = true;
    }
};

// Функция для отключения наблюдателя
function deactivateObserver() {
    if (observerActive) {
        observer.disconnect();
        observerActive = false;
    }
};

let promocodes = []; // Переменная для хранения промокодов
let promoServer = [];



chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.message === 'url-changed') {
            activateObserver();
            console.log('смена урла')
        }

        if (document.querySelector('.table_parent__content') && document.querySelector('.ext-table')) {
            document.querySelector('.table_parent__content').remove();
            document.querySelector('.ext-table').remove();
        }

});

const apiUrl = 'https://borislav2515.github.io/tour/promocode.json';
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        promoServer = data;
    })
    .catch(error => {
        console.error('Ошибка при загрузке файла:', error);
    });


window.addEventListener('load', function() {
     const linkElement = document.createElement('link');
     const cssUrl = chrome.runtime.getURL('style.css');
     linkElement.rel = 'stylesheet';
     linkElement.type = 'text/css';
     linkElement.href = cssUrl; 
     document.head.appendChild(linkElement);
     
    let currentUrl = window.location.pathname;
    document.querySelector('body').append(btnStart);

    if (currentUrl !== "/catalog/" && currentUrl !== "/brands/") {
        btnStart.disabled = false;
    } else {
        btnStart.disabled = true;
    }

    activateObserver();
});




function startApp() {

    data_items = [];
    productCards = [];
    let promoValActive = true;
    let unusedPromocodes = [];


    productCards = Array.from(document.querySelectorAll('.catalog-items-list > div:not(.catalog-item_out-of-stock):not(.catalog-item_banner):not(.catalog-item_banner'));

    const table_parent = getElement('.catalog-listing-controls');
    const table_parent__content = createElementBlock('div', 'table_parent__content');

    const buttonShow_wrap = createElementBlock('div', 'buttonShow_wrap');

    const promocode_wrap = createElementBlock('div', 'promocode_wrap');
    const title = createElementBlock('h3', 'promocode-list__title', 'Выберите промокоды которые вы уже использовали');
    promocode_wrap.appendChild(title);
        
     // использовать промокод блок
    const promocodeCheckboxesWrap = createElementBlock('div', 'promocode-checkboxes-wrap');

    const promocodeCheckboxesLabel = createElementBlock('label', 'promocode-checkboxes-label', 'Использовать промокоды');
    promocodeCheckboxesLabel.htmlFor = 'promocode-checkboxes';

    const promocodeCheckboxes = document.createElement('input');
        promocodeCheckboxes.type = 'checkbox';
        promocodeCheckboxes.id = 'promocode-checkboxes';
        promocodeCheckboxes.classList.add('promocode-checkboxes');
        promocodeCheckboxesWrap.append(promocodeCheckboxes, promocodeCheckboxesLabel);
    // --

        const promocodeList = createPromocodeList(promoServer); // Создание списка промокодов
        promocode_wrap.appendChild(promocodeList);
        table_parent.appendChild(table_parent__content);
        table_parent__content.appendChild(buttonShow_wrap);
        
        const table = createElementBlock('table', 'ext-table');
        table_parent.appendChild(table);

        const thead = createElementBlock('thead', 'ext-thead');
        const tr = createElementBlock('tr', 'ext-tr');
        thead.appendChild(tr);
        

        table.appendChild(thead);
        const tbody = createElementBlock('tbody', 'ext-tbody');
        table.appendChild(tbody);
        
        let tableTitle = [];
            tableTitle = [
                { name: 'Название', atr: 'name' },
                { name: 'Магазин', atr: 'shop' },
                { name: 'Цена', atr: 'price' },
                { name: 'Бонусы %', atr: 'bonus' },
                { name: 'Итого', atr: 'total' },
                { name: 'Промокод', atr: 'promocode' },
            ];

        tableTitle.forEach((item) => {
            const td = createElementBlock('td', 'ext-td');
            const tableTitle_a = createElementBlock('a', 'ext-td-link', item.name);
            tableTitle_a.href = '#';
            td.appendChild(tableTitle_a);
            tr.appendChild(td);

            tableTitle_a.addEventListener('click', (event) => {
                event.preventDefault();
                if (item.atr === 'name') {
                    filterProducts(data_items, tbody, 'name')
                } else if (item.atr === 'shop') {
                    filterProducts(data_items, tbody, 'shop')
                } else if(item.atr === 'price') {
                    filterProducts(data_items, tbody, 'price')
                } else if(item.atr === 'bonus') {
                    filterProductsBonus(data_items, tbody, 'bonus')
                } else if(item.atr === 'total') {
                    filterProducts(data_items, tbody, 'total')
                } else if(item.atr === 'promocode') {
                    filterProducts(data_items, tbody, 'promocode')
                }
            });
        });

        
        
        let totalPagesLoaded = 1; // Переменная для отслеживания количества загруженных страниц
        // Добавляем количество загруженных страниц
        let count_page = createElementBlock('span', 'ext-count_page');
        if (count_page !== null) {
            count_page.innerText = totalPagesLoaded > 1 ? `Загруженно страниц: ${totalPagesLoaded}` : 'Загруженно страниц: 1';
        } else {
            console.log('count_page отсутсвует')
        }

        // Добавляем кнопку "Загрузить еще товары" и клик по ней
        let buttonShow = createElementBlock('button', 'ext-button', 'Загрузить еще товары');
        buttonShow.addEventListener('click', () => {
            const btnMoreProduct = document.querySelector('.catalog-items-list__show-more');
        
            if (!btnMoreProduct || totalPagesLoaded > 11) {
                buttonShow.disabled = true;
                buttonShow.classList.add('disabled');
                button_all_show.disabled = true;
                button_all_show.classList.add('disabled');
                return;
            } else {
                btnMoreProduct.click();
                setTimeout(() => {
                    parsingData();
                    if (count_page) {
                        totalPagesLoaded++;
                        count_page.innerText = totalPagesLoaded > 1 ? `Загруженно страниц: ${totalPagesLoaded}` : 'Загруженно страниц: 1';
                    } else {
                        console.log('count_page отсутсвует')
                    }
                    tabulate(data_items, tbody);
                }, 500); // Задержка в 500 миллисекунд
            }
        });

        // Добавляем количество загруженных товаров
        let count_products = createElementBlock('span', 'ext-count_products');
        count_products.innerText = updateProductCount(productCards);

        // Добавляем кнопку "Автозагрузка товаров" и клик по ней
        const button_all_show = createElementBlock('button', 'ext-button', 'Автозагрузка товаров');
        let autoLoadActive = false;
        let paginationInterval; // Переменная для хранения интервала автозагрузки
        button_all_show.addEventListener('click', () => {
            if (autoLoadActive === true) {
                autoLoadActive = false;
                button_all_show.innerText = 'Автозагрузка товаров';
                clearTimeout(paginationInterval); // Остановка автозагрузки
            } else {
                autoLoadActive = true;
                button_all_show.innerText = 'Отключить автозагрузку';
                // Проверка, чтобы не запускать новую автозагрузку, если уже активна
                if (!paginationInterval) {
                    loadMoreProducts();
                }
            }
        });

        // Добавляем кнопку "Открыть таблицу" и клик по ней
        const tabulate_data_btn = createElementBlock('button', 'ext-button', 'Открыть таблицу');
        tabulate_data_btn.addEventListener('click', tableOpen)
        function tableOpen() {
            if (promoValActive === true ) {
                table.classList.toggle('active');
                if (table.classList.contains('active')) {
                    tabulate_data_btn.innerText = 'Скрыть таблицу';
                    tbody.innerHTML = '';
                } else {
                    tabulate_data_btn.innerText = 'Открыть таблицу';
                };

                setTimeout(() => {
                    clearData();
                    parsingData();
                    count_products.innerText = updateProductCount(productCards);
                    tabulate(data_items, tbody);
                }, 500); // Задержка в 500 миллисекунд
            } else {
                return
            }
        }
 
        promocodeCheckboxes.addEventListener('change', function() {
            if (this.checked) {
                promoValActive = false;
                promocode_wrap.style.display = 'flex';
            } else {
                promoValActive = true;
                promocode_wrap.style.display = 'none';
                promocodes = []; // Очищаем массив промокодов
                clearData();
                parsingData();
                tbody.innerHTML = '';
                tabulate(data_items, tbody);
            }
        })  
        
        const selectButton = createElementBlock('button', 'ext-button', 'Выбрать');
        selectButton.addEventListener('click', () => {
            unusedPromocodes = [];
            promoValActive = true;
            promocode_wrap.style.display = 'none';
        
            const checkboxes = document.querySelectorAll('.promocode_wrap input[type="checkbox"]');
            
            // Получаем список промокодов, которые пользователь не отметил
            checkboxes.forEach(function(checkbox) {
                if (!checkbox.checked) {
                    unusedPromocodes.push(checkbox.value);
                }
            });
        
            // Оставляем только те промокоды из promoServer, которые есть в массиве unusedPromocodes
            for (const promoCode in promoServer) {
                if (unusedPromocodes.includes(promoCode)) {
                    promocodes[promoCode] = promoServer[promoCode];
                }
            }
            // clearData();
            // parsingData();
            // tbody.innerHTML = '';
            // tabulate(data_items, tbody);
            tableOpen()
        });

        promocode_wrap.appendChild(selectButton);

        buttonShow_wrap.append(buttonShow, count_products, button_all_show, count_page,  tabulate_data_btn, promocodeCheckboxesWrap, promocode_wrap);

        function clearData() {
            data_items = [];
        }

        function loadMoreProducts() {
            let paginationButton = document.querySelector('.catalog-items-list__show-more');
            parsingData();
            count_products.innerText = updateProductCount(productCards);
            tabulate(data_items, tbody);
        
            if (paginationButton && totalPagesLoaded < 11) {
                paginationButton.click();
        
                let delay = 3000;
                paginationInterval = setTimeout(function () {
                    loadMoreProducts();
                    totalPagesLoaded++;
                    count_page.innerText = totalPagesLoaded > 1 ? `Загруженно страниц: ${totalPagesLoaded}` : 'Загруженно страниц: 1';
                }, delay);
            } else {
                button_all_show.disabled = true;
                button_all_show.classList.add('disabled');
            };
        };

        function parsingData() {
            productCards = Array.from(document.querySelectorAll('.catalog-items-list > div:not(.catalog-item_out-of-stock):not(.catalog-item_banner):not(.catalog-item_banner'));
            if (!productCards || productCards.length === 0) {
                console.log('Карточек нет или массив пуст');
                return;
            }

            productCards.forEach((card) => {
                let productID = card.id;
                const exists = data_items.some(item => item.id === productID);
                if (!exists) {
                    let name = card.querySelector('.catalog-item-regular-desktop__main-info > a.ddl_product_link');
                    if (name !== null) {
                        name = name.innerText.replace(/[%\u20BD]/g, '');
                    }

                    let namelink = card.querySelector('.catalog-item-regular-desktop__main-info > a.ddl_product_link') !== null ? card.querySelector('.catalog-item-regular-desktop__main-info > a.ddl_product_link').href : 'https://megamarket.ru/';

                    // let shop = card.querySelector('.merchant-info__name')?.innerText || 'Неизвестен';
                    let shop = card.querySelector('.merchant-info__name') !== null ? card.querySelector('.merchant-info__name').innerText : 'Неизвестен';
                    
                    // let shopLink = card.querySelector('.catalog-item__merchant-info')?.href || 'Неизвестен';
                    let shopLink = card.querySelector('.catalog-item__merchant-info') !== null ? card.querySelector('.catalog-item__merchant-info').href : 'https://megamarket.ru/';

                    // let price = parseInt(card.querySelector('.item-price > span').innerText.replace(/[^\d]/g, '').trim());
                    let price = card.querySelector('.catalog-item-regular-desktop__price') !== null ? parseInt(card.querySelector('.catalog-item-regular-desktop__price').innerText.replace(/[^\d]/g, '').trim()) : '-';
                    let promo = '';


                    if (promoValActive === true) {
                        price = getBestDiscount(parseInt(card.querySelector('.catalog-item-regular-desktop__price').innerText.replace(/[^\d]/g, '').trim()), promocodes,'price');
                        promo = getBestDiscount(parseInt(card.querySelector('.catalog-item-regular-desktop__price').innerText.replace(/[^\d]/g, '').trim()), promocodes,'promo')
                    } 

                    
                    
                    // let bonusPercent = parseInt(card.querySelector('.bonus-percent').innerText);
                    let bonusPercent = card.querySelector('.bonus-percent') !== null ? parseInt(card.querySelector('.bonus-percent').innerText) ||  "-" : 1;

                    const total = calculateTotal(price, bonusPercent);

                    data_items.push({
                        id: productID,
                        name: name,
                        namelink: namelink,
                        shop: shop,
                        shopLink: shopLink,
                        price: price,
                        bonus: bonusPercent,
                        promocode : promo,
                        total: total,
                    });
                }
            });
            
            if (!productCards) {
                return console.log('Карточек нет');
            };

            if (count_products) {
                count_products.innerText = updateProductCount(productCards);
            };

        };


}
