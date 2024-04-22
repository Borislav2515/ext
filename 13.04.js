'use strict';

import { getElement } from './getElement';
import { createElementText, createElementBlock } from './createElement';
import { filterProducts, tabulate, filterProductsBonus } from './fillter_products';
import { updateProductCount } from './updateProductCount.js';

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

let btnStart = document.createElement('button');
btnStart.classList.add('btnStart');
btnStart.innerText = 'Запустить';
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

// try {
//     // Попытка установить связь или выполнить операции
//     chrome.runtime.sendMessage({ message: 'connect' }, (response) => {
//         console.log('Ответ от скрипта:', response);
//     });
// } catch (error) {
//     console.error('Ошибка при установке связи:', error);
//     // Дополнительные действия при возникновении ошибки, если необходимо
// }


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.message === 'url-changed') {
            activateObserver();
        }

        if (document.querySelector('.table_parent__content') && document.querySelector('.ext-table')) {
            document.querySelector('.table_parent__content').remove();
            document.querySelector('.ext-table').remove();
        }
});


window.addEventListener('load', function() {
     // Создаем ссылку на CSS файл
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

    // Добавляем наблюдателя, если это необходимо
    activateObserver();
});

const apiUrl = 'https://borislav2515.github.io/tour/promocode.json';
let promocodes = []; // Переменная для хранения промокодов
let promoServer = [];
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    promoServer = data;
  })
  .catch(error => {
    console.error('Ошибка при загрузке файла:', error);
  });



function startApp() {

        data_items = [];
        productCards = [];
        let promoValActive = true;

        productCards = Array.from(document.querySelectorAll('.catalog-item:not(.catalog-item_out-of-stock):not(.catalog-item_banner):not(.catalog-item_banner'));

        const table_parent = getElement('.catalog-listing-controls');
        const table_parent__content = createElementBlock('div', 'table_parent__content');

        const buttonShow_wrap = createElementBlock('div', 'buttonShow_wrap');

        const promocode_wrap = createElementBlock('div', 'promocode_wrap');
        

        const root = createElementBlock('div', 'css__content');
        const cssUrl = chrome.runtime.getURL('style.css');
        root.innerHTML = `<link rel="stylesheet" href="${cssUrl}">`;

        // использовать промокод блок
        const promocodeCheckboxesWrap = document.createElement('div');
            promocodeCheckboxesWrap.classList.add('promocode-checkboxes-wrap');
        const promocodeCheckboxesLabel = document.createElement('label');
            promocodeCheckboxesLabel.classList.add('promocode-checkboxes-label');
            promocodeCheckboxesLabel.innerText = 'Использовать промокоды';
            promocodeCheckboxesLabel.htmlFor = 'promocode-checkboxes';
        const promocodeCheckboxes = document.createElement('input');
            promocodeCheckboxes.type = 'checkbox';
            promocodeCheckboxes.id = 'promocode-checkboxes';
            promocodeCheckboxes.classList.add('promocode-checkboxes');
            promocodeCheckboxesWrap.append(promocodeCheckboxes, promocodeCheckboxesLabel);
        // --

        // список промокодов
            const promocodeList = document.createElement('div');
                promocodeList.classList.add('promocode-list');  
            const promocodeWrap = document.createElement('div');
                promocodeWrap.classList.add('promocode-wrap');
                promocode_wrap.appendChild(promocodeCheckboxesWrap)
        
            const title = document.createElement('h3');
                title.innerText = 'Выберите промокоды которые вы уже использовали';
                promocodeList.appendChild(title);
        
            for (const promocode in promoServer) {
                const promocodeItem = document.createElement('label');
                promocodeItem.classList.add('checkbox', 'style-e');
        
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = promocode; 
        
                const checkmarkDiv = document.createElement('div');
                checkmarkDiv.classList.add('checkbox__checkmark');
        
                const bodyDiv = document.createElement('div');
                bodyDiv.classList.add('checkbox__body');
                bodyDiv.innerText = promocode; 
        
                promocodeItem.appendChild(checkbox);
                promocodeItem.appendChild(checkmarkDiv);
                promocodeItem.appendChild(bodyDiv);
        
                promocodeWrap.appendChild(promocodeItem);
                promocodeList.appendChild(promocodeWrap);
            }
        
            const selectButton = document.createElement('button');
            selectButton.classList.add('ext-button' , 'select-button');
            selectButton.innerText = 'Выбрать';
        
            promocodeList.appendChild(selectButton);
        // --

        const existingTable = document.querySelector('.ext-table');

        if (!table_parent__content) {
            return;
        } else {
            table_parent__content.appendChild(root);
        };
        
        table_parent.appendChild(table_parent__content);
        table_parent__content.appendChild(buttonShow_wrap);
        
        const table = document.createElement('table');
        table.classList.add('ext-table');
        table_parent.appendChild(table);
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        thead.appendChild(tr);

        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        table.appendChild(tbody);
        
        let tableTitle = [];
            tableTitle = [
                { name: 'Название', atr: 'name' },
                { name: 'Магазин', atr: 'shop' },
                { name: 'Цена', atr: 'price' },
                { name: 'Бонусы %', atr: 'bonus' },
                { name: 'Итого', atr: 'total' },
            ];

        tableTitle.forEach((item) => {
            const td = createElementBlock('td', 'ext-td');
            const tableTitle_a = createElementText('a', 'ext-td-link', item.name);
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
                }
            });
        });

        let totalPagesLoaded = 1; // Переменная для отслеживания количества загруженных страниц
        if (count_page ) {
            totalPagesLoaded++;
            count_page.innerText = totalPagesLoaded > 1 ? `Загруженно страниц: ${totalPagesLoaded}` : 'Загруженно страниц: 1';
        };
        // Добавляем кнопку "Загрузить еще товары" и клик по ней
        let buttonShow = createElementText('button', 'ext-button', 'Загрузить еще товары');
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
                    if (count_page ) {
                        totalPagesLoaded++;
                        console.log(totalPagesLoaded);
                        count_page.innerText = totalPagesLoaded > 1 ? `Загруженно страниц: ${totalPagesLoaded}` : 'Загруженно страниц: 1';
                    };
                    tabulate(data_items, tbody);
                }, 500); // Задержка в 500 миллисекунд
            }
        });

        // Добавляем количество загруженных товаров
        let count_products = createElementBlock('span', 'ext-count_products');
        count_products.innerText = updateProductCount(productCards);

        // Добавляем кнопку "Автозагрузка товаров" и клик по ней
        const button_all_show = createElementText('button', 'ext-button', 'Автозагрузка товаров');
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

        // Добавляем количество загруженных страниц
        let count_page = createElementBlock('span', 'ext-count_page');
        if (count_page) {
            count_page.innerText = "Загруженно страниц: 1";
        };

        // Добавляем кнопку "Открыть таблицу" и клик по ней
        const tabulate_data_btn = createElementText('button', 'ext-button', 'Открыть таблицу');
        tabulate_data_btn.addEventListener('click', () => {
            if (promoValActive === true) {
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
        });

        promocodeCheckboxes.addEventListener('change', function() {
            if (this.checked) {
                // Показываем список промокодов
                promoValActive = false;
                promocodeList.style.display = 'flex';
            } else if(!this.checked) {
                clearData();
                parsingData();
                tbody.innerHTML = '';
                tabulate(data_items, tbody);
                promoValActive = true;
                promocodeList.style.display = 'none';
            }
        })  

        let unusedPromocodes = [];
        selectButton.addEventListener('click', function() {
            unusedPromocodes = [];
            promoValActive = true;
            promocodeList.style.display = 'none';
        
            const checkboxes = document.querySelectorAll('.promocode-wrap input[type="checkbox"]');
            
            // Получаем список промокодов, которые пользователь не отметил
            checkboxes.forEach(function(checkbox) {
                if (!checkbox.checked) {
                    unusedPromocodes.push(checkbox.value);
                }
            });
        
            // Оставляем только те промокоды из promoServer, которые есть в массиве unusedPromocodes
            const filteredPromocodes = {};
            for (const promoCode in promoServer) {
                if (unusedPromocodes.includes(promoCode)) {
                    promocodes[promoCode] = promoServer[promoCode];
                }
            }
            
            clearData();
            parsingData();
            tbody.innerHTML = '';
            const td = createElementBlock('td', 'ext-td');
            const tableTitle_a = createElementText('button', 'ext-td-link', 'Промокод');
            td.appendChild(tableTitle_a);
            tr.appendChild(td);
            tabulate(data_items, tbody);

        });
  
        buttonShow_wrap.append(buttonShow, count_products, button_all_show, count_page,  tabulate_data_btn, promocode_wrap, promocodeList);

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

        function clearData() {
            data_items = [];
        }

        function parsingData() {
            productCards = Array.from(document.querySelectorAll('.catalog-item:not(.catalog-item_out-of-stock):not(.catalog-item_banner):not(.catalog-item_banner'));
            if (!productCards || productCards.length === 0) {
                console.log('Карточек нет или массив пуст');
                return;
            }

            productCards.forEach((card) => {
                let productID = card.id;
                const exists = data_items.some(item => item.id === productID);
                if (!exists) {
                    let name = card.querySelector('.item-title > a');
                    if (name !== null) {
                        name = removeExtraCharacters(name.innerText);
                    }

                    let namelink = card.querySelector('.item-title > a') !== null ? card.querySelector('.item-title > a').href : 'https://megamarket.ru/';

                    // let shop = card.querySelector('.merchant-info__name')?.innerText || 'Неизвестен';
                    let shop = card.querySelector('.merchant-info__name') !== null ? card.querySelector('.merchant-info__name').innerText : 'Неизвестен';
                    
                    // let shopLink = card.querySelector('.catalog-item__merchant-info')?.href || 'Неизвестен';
                    let shopLink = card.querySelector('.catalog-item__merchant-info') !== null ? card.querySelector('.catalog-item__merchant-info').href : 'https://megamarket.ru/';

                    // let price = parseInt(card.querySelector('.item-price > span').innerText.replace(/[^\d]/g, '').trim());
                    let price = card.querySelector('.item-price > span') !== null ? parseInt(card.querySelector('.item-price > span').innerText.replace(/[^\d]/g, '').trim()) : '-';
                    let promo = '';

                    if (promoValActive === true) {
                        price = getBestDiscount(parseInt(card.querySelector('.item-price > span').innerText.replace(/[^\d]/g, '').trim()), promocodes,'price');
                        promo = getBestDiscount(parseInt(card.querySelector('.item-price > span').innerText.replace(/[^\d]/g, '').trim()), promocodes,'promo')
                    } 

                    
                    
                    // let bonusPercent = parseInt(card.querySelector('.bonus-percent').innerText);
                    let bonusPercent = card.querySelector('.bonus-percent') !== null ? parseInt(card.querySelector('.bonus-percent').innerText) ||  '-' : '-';

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

        function getBestDiscount(price, promocodes, value) {
            let bestDiscount = 0;
            let bestPromo = null;
           
            for (const promoName in promocodes) {
                const promoArray = promocodes[promoName];
                for (const promo of promoArray) {
                    if (price >= promo.price_to && promo.discount > bestDiscount) {
                        bestDiscount = promo.discount;
                        bestPromo = promoName;
                    }
                }
            }
            
            if (value === "price") {
                return price - bestDiscount;
            } else if (value === "promo") {
                return bestPromo;
            }
        }
           
        function removeExtraCharacters(inputString) {
            // Используем регулярное выражение для удаления символов процентов и рубля
            if(!inputString) {
                return 0;
            }
            return inputString.replace(/[%\u20BD]/g, '');
        };

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

}
