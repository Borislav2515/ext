window.addEventListener('load', function () {
    const promocode = [
        {
            "СЕЛЬДЬ": [
                { "discount": 1000, "price_from": 8000 },
                { "discount": 2000, "price_from": 17000 },
                { "discount": 3000, "price_from": 25000 },
                { "discount": 4000, "price_from": 30000 }
            ],
            "ИКРА": [
                { "discount": 2000, "price_from": 11000 },
                { "discount": 5000, "price_from": 30000 },
                { "discount": 9000, "price_from": 50000 },
                { "discount": 12000, "price_from": 75000 }
            ],
            "ИНД": [
                { "discount": 1000, "price_from": 6000 },
                { "discount": 5000, "price_from": 30000 },
                { "discount": 10000, "price_from": 55000 },
                { "discount": 20000, "price_from": 110000 }
            ]
        }
    ]

    const items = [];
    let currentSortFunction = null;

    setTimeout(() => {

        let tableParent = document.querySelector('.catalog-listing-controls');

        const root = document.createElement('div');
        const cssUrl = chrome.runtime.getURL('style.css');
        root.innerHTML = `<link rel="stylesheet" href="${cssUrl}">`;

        if (!tableParent) {
            return;
        } else {
            tableParent.appendChild(root);
        }

        // Создаем кнопку старт
        let button = document.createElement('button');
        button.classList.add('ext-button');
        button.innerText = 'Запустить расширение';
        tableParent.appendChild(button);

        let count_products = document.createElement('span');
        count_products.classList.add('ext-count_products');
        tableParent.appendChild(count_products);

        // content
        let content = document.createElement('div');
        content.classList.add('ext-content');

        let priceWhitePromocode__input = document.createElement('input');
        priceWhitePromocode__input.classList.add('ext-priceWhitePromocode__input', 'input');
        priceWhitePromocode__input.type = 'checkbox';
        priceWhitePromocode__input.placeholder = 'Цены с учетом промокода';

        let priceWhitePromocode__label = document.createElement('label');
        priceWhitePromocode__label.classList.add('ext-priceWhitePromocode__label');
        priceWhitePromocode__label.innerText = 'Цены с учетом промокода';

        let input__wrap = document.createElement('div');
        input__wrap.classList.add('ext-input__wrap');
        input__wrap.appendChild(priceWhitePromocode__input);
        input__wrap.appendChild(priceWhitePromocode__label);


        content.appendChild(input__wrap);

        let table = document.createElement('table');
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');


        let tr__names = document.createElement('tr');
        tr__names.className = 'ext-tr__names';
        table.appendChild(thead);

        thead.appendChild(tr__names);
        table.appendChild(tbody);

        let th_name = document.createElement('th');
        th_name.innerText = 'Название товара';
        tr__names.appendChild(th_name);

        let th_shop = document.createElement('th');
        th_shop.innerText = 'Название магазина';
        tr__names.appendChild(th_shop);

        let th_price = document.createElement('th');
        th_price.innerText = 'Цена';
        tr__names.appendChild(th_price);

        let th_bonus = document.createElement('th');
        th_bonus.innerText = 'Бонусы';
        tr__names.appendChild(th_bonus);

        let total = document.createElement('th');
        total.innerText = 'Итог';
        tr__names.appendChild(total);


        // заголовок фильтра
        let tr_fillter = document.createElement('tr');
        tr_fillter.className = 'ext-tr__fillter';
        thead.appendChild(tr_fillter);

        let th_name_fillter = document.createElement('th');
        let th_name_fillter_link = document.createElement('button');
        th_name_fillter_link.className = 'ext-th_name_fillter_link';
        th_name_fillter_link.innerText = 'Сортировать по названию';
        th_name_fillter.appendChild(th_name_fillter_link);
        tr_fillter.appendChild(th_name_fillter);

        let th_shop_fillter = document.createElement('th');
        th_shop_fillter.className = 'ext-th_shop_fillter_link';
        let th_shop_fillter_link = document.createElement('button');
        th_shop_fillter_link.innerText = 'Сортировать по магазину';
        th_shop_fillter.appendChild(th_shop_fillter_link);
        tr_fillter.appendChild(th_shop_fillter);

        let th_price_fillter = document.createElement('th');
        let th_price_fillter_link = document.createElement('button');
        th_price_fillter_link.innerText = 'Сортировать по Ценe';
        th_price_fillter.appendChild(th_price_fillter_link);
        tr_fillter.appendChild(th_price_fillter);

        let th_bonus_fillter = document.createElement('th');
        let th_bonus_fillter_link = document.createElement('button');
        th_bonus_fillter_link.innerText = 'Сортировать по Бонусам';
        th_bonus_fillter.appendChild(th_bonus_fillter_link);
        tr_fillter.appendChild(th_bonus_fillter);

        let itog_fillter = document.createElement('th');
        let th_itog_fillter_link = document.createElement('button');
        th_itog_fillter_link.innerText = 'Сортировать по Итог';
        itog_fillter.appendChild(th_itog_fillter_link);
        tr_fillter.appendChild(itog_fillter);


        button.addEventListener('click', () => {
            content.classList.toggle('active');
            if (content.classList.contains('active')) {
                button.innerText = 'Скрыть расширение';
            } else {
                button.innerText = 'Запустить расширение';
            }
            parsingData()
        })

        function parsingData() {
            items.length = 0;
            // Собираем информацию по карточкам
            let catalogItem = document.querySelectorAll('.catalog-item:not(.catalog-item_out-of-stock)');

            catalogItem.forEach((card, index) => {

                let name = card.querySelector('.item-title > a');
                waitForElementToAppear(name, function (element) {
                    name = name.getAttribute('title');
                    return name
                });

                let image = card.querySelector('.catalog-item-photo > img:first-child');
                waitForElementToAppear(image, function (element) {
                    image = image.src;
                    return image
                })

                let shop_name = card.querySelector('.merchant-info__name');
                waitForElementToAppear(shop_name, function (element) {
                    shop_name = shop_name.innerText;
                    return shop_name
                });

                let link = card.querySelector('.item-title .ddl_product_link');
                waitForElementToAppear(link, function (element) {
                    link = link.href;
                    return link
                });

                let price = card.querySelector('.item-price > span');
                waitForElementToAppear(price, function (element) {
                    price = price.innerText;
                    let cleanPrice = price.replace(/[^\d]/g, ''); // Удаляем все символы кроме цифр
                    cleanPrice = cleanPrice.trim()
                    price = parseInt(cleanPrice)

                    let maxDiscount = 0;
                    for (const code in promocode[0]) {
                        const options = promocode[0][code];

                        for (const option of options) {
                            if (price >= option.price_from && option.discount > maxDiscount) {
                                maxDiscount = option.discount;
                            }
                        }
                    }

                    let priceWithDiscount = price - maxDiscount;


                    if (priceWhitePromocode__input.checked) {
                        return price = priceWithDiscount
                    } else {
                        return price
                    }

                });

                let bonus = card.querySelector('.bonus-percent');
                waitForElementToAppear(bonus, function (element) {
                    number_without_spaces = bonus.innerText;
                    number_without_spaces = number_without_spaces.replace(" ", "")
                    bonus = parseInt(number_without_spaces)
                    return bonus
                });
                bonus = price * bonus / 100;
                bonus_total = Math.ceil(bonus);


                if (priceWhitePromocode__input.checked) {
                    total = priceWithDiscount - bonus_total
                } else {
                    total = price - bonus_total;
                }




                tbody.innerHTML = ' ';
                items.forEach((item, index) => {
                    let row = document.createElement("tr");

                    let product_name = document.createElement("td");
                    product_name.classList.add('ext-name');

                    let link = document.createElement("a");
                    link.textContent = item.product_name;
                    link.href = item.product_link;
                    link.target = '_blank';
                    product_name.appendChild(link);

                    let nameShop = document.createElement("td");
                    nameShop.textContent = item.shop_name;

                    let price = document.createElement("td");
                    price.textContent = item.price;

                    let bonus = document.createElement("td");
                    bonus.textContent = item.bonus;

                    let total = document.createElement("td");
                    total.textContent = item.total;

                    row.appendChild(product_name);
                    row.appendChild(nameShop);
                    row.appendChild(price);
                    row.appendChild(bonus);
                    row.appendChild(total);
                    tbody.appendChild(row);

                })

                items.push({
                    product_name: name,
                    shop_name: shop_name,
                    product_link: link,
                    price: price,
                    bonus: bonus_total,
                    total: total,
                    image: image,
                    priceWithDiscount: priceWithDiscount
                });
            });


            //container 
            let container = document.createElement('div');
            container.classList.add('ext-container');

            // Получаем ссылку на таблицу


            tableParent.appendChild(container);
            // container.appendChild(root);
            container.appendChild(content);
            content.appendChild(table);

            items.forEach((item, index) => {
                let row = document.createElement("tr");

                let name = document.createElement("td");
                name.classList.add('ext-name');

                let link = document.createElement("a");
                link.textContent = item.product_name;
                link.href = item.product_link;
                link.target = '_blank';
                name.appendChild(link);

                let nameShop = document.createElement("td");
                nameShop.textContent = item.shop_name;

                let price = document.createElement("td");
                price.textContent = item.price;

                let bonus = document.createElement("td");
                bonus.textContent = item.bonus;

                let total = document.createElement("td");
                total.textContent = item.total;

                row.appendChild(name);
                row.appendChild(nameShop);
                row.appendChild(price);
                row.appendChild(bonus);
                row.appendChild(total);
                tbody.appendChild(row);

            })

        }

        let buttonShow = document.createElement('button');
        buttonShow.classList.add('ext-button_show');
        buttonShow.innerText = `Показать товар`;
        tableParent.appendChild(buttonShow);

        buttonShow.addEventListener('click', () => {
            let btnValudate = document.querySelector('.catalog-items-list__show-more');
            if (btnValudate) {
                btnValudate.click();
                count_products.innerText = 'Количество товаров: ' + items.length;
                tbody.innerHTML = ' ';
                items.length = 0;
                parsingData()
            } else {
                console.log('Кнопка не найдена');
            }
        })


        function renderRow(item) {
            let row = document.createElement("tr");

            let name = document.createElement("td");
            name.classList.add('ext-name');

            let link = document.createElement("a");
            link.textContent = item.product_name;
            link.href = item.product_link;
            link.target = '_blank';
            name.appendChild(link);

            let nameShop = document.createElement("td");
            nameShop.textContent = item.shop_name;

            let price = document.createElement("td");
            price.textContent = item.price;

            let bonus = document.createElement("td");
            bonus.textContent = item.bonus;

            let total = document.createElement("td");
            total.textContent = item.total;

            row.appendChild(name);
            row.appendChild(nameShop);
            row.appendChild(price);
            row.appendChild(bonus);
            row.appendChild(total);
            tbody.appendChild(row);
        }


        priceWhitePromocode__input.addEventListener('change', () => {
            if (priceWhitePromocode__input.checked) {
                items.sort(currentSortFunction); // Применяем текущую функцию сортировки
                tbody.innerHTML = ''; // Очищаем содержимое tbody
                items.forEach(item => renderRow(item)); // Перерисовываем таблицу
                parsingData();
            } else {
                // Если чекбокс не отмечен, применяем сортировку по умолчанию (без сортировки)
                tbody.innerHTML = ''; // Очищаем содержимое tbody
                items.forEach(item => renderRow(item)); // Перерисовываем таблицу без сортировки
                parsingData();
            }
        });

        // Объект для хранения функций сортировки
const sortFunctions = {
    'name': (a, b) => a.product_name.localeCompare(b.product_name, 'ru', { sensitivity: 'base' }),
    'shop': (a, b) => a.shop_name.localeCompare(b.shop_name, 'ru', { sensitivity: 'base' }),
    'price': (a, b) => a.price - b.price,
    'total': (a, b) => a.total - b.total,
    'bonus': (a, b) => b.bonus - a.bonus
};

// Функция для создания строки таблицы
function createTableRow(item) {
    const row = document.createElement('tr');

    const name = document.createElement('td');
    name.classList.add('ext-name');
    const link = document.createElement('a');
    link.textContent = item.product_name;
    link.href = item.product_link;
    link.target = '_blank';
    name.appendChild(link);

    const nameShop = document.createElement('td');
    nameShop.textContent = item.shop_name;

    const price = document.createElement('td');
    price.textContent = item.price;

    const bonus = document.createElement('td');
    bonus.textContent = item.bonus;

    const total = document.createElement('td');
    total.textContent = item.total;

    row.appendChild(name);
    row.appendChild(nameShop);
    row.appendChild(price);
    row.appendChild(bonus);
    row.appendChild(total);

    return row;
}

// Функция для сортировки и отображения данных
function sortAndRender(sortKey) {
    items.sort(sortFunctions[sortKey]);
    currentSortFunction = sortAndRender;

    tbody.innerHTML = '';

    items.forEach(item => {
        const row = createTableRow(item);
        tbody.appendChild(row);
    });
}

// Назначаем обработчики событий для сортировки
th_name_fillter_link.addEventListener('click', () => sortAndRender('name'));
th_shop_fillter_link.addEventListener('click', () => sortAndRender('shop'));
th_price_fillter_link.addEventListener('click', () => sortAndRender('price'));
th_itog_fillter_link.addEventListener('click', () => sortAndRender('total'));
th_bonus_fillter_link.addEventListener('click', () => sortAndRender('bonus'));

// Первоначальная сортировка
sortAndRender('name');


        // проверка элемента на странице
        function waitForElementToAppear(selector, callback) {
            const element = selector;
            if (element) {
                callback(element);
            } else {
                setTimeout(function () {
                    waitForElementToAppear(selector, callback);
                }, 100); // Проверяем каждые 100 миллисекунд
            }
        }

    }, "5000");

});
