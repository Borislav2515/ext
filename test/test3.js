window.addEventListener('load', () => {
    const promocode = {
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
    };

    const items = [];
    const fillter_items = [];

    setTimeout(initializeExtension, 5000);

    function initializeExtension() {
        const tableParent = document.querySelector('.catalog-listing-controls');
        if (!tableParent) return;

        const root = document.createElement('div');
        const cssUrl = chrome.runtime.getURL('style.css');
        root.innerHTML = `<link rel="stylesheet" href="${cssUrl}">`;
        tableParent.appendChild(root);

        const button = document.createElement('button');
        button.classList.add('ext-button');
        button.innerText = 'Запустить расширение';
        tableParent.appendChild(button);

        const count_products = document.createElement('span');
        count_products.classList.add('ext-count_products');
        tableParent.appendChild(count_products);

        const content = document.createElement('div');
        content.classList.add('ext-content');
        tableParent.appendChild(content);

        const priceWhitePromocode__input = document.createElement('input');
        priceWhitePromocode__input.classList.add('ext-priceWhitePromocode__input', 'input');
        priceWhitePromocode__input.type = 'checkbox';
        priceWhitePromocode__input.placeholder = 'Цены с учетом промокода';

        const priceWhitePromocode__label = document.createElement('label');
        priceWhitePromocode__label.classList.add('ext-priceWhitePromocode__label');
        priceWhitePromocode__label.innerText = 'Цены с учетом промокода';

        const input__wrap = document.createElement('div');
        input__wrap.classList.add('ext-input__wrap');
        input__wrap.appendChild(priceWhitePromocode__input);
        input__wrap.appendChild(priceWhitePromocode__label);

        content.appendChild(input__wrap);

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const tr__names = document.createElement('tr');
        tr__names.className = 'ext-tr__names';
        thead.appendChild(tr__names);
        table.appendChild(thead);
        table.appendChild(tbody);
        content.appendChild(table);

        const th_name = document.createElement('th');
        th_name.innerText = 'Название товара';
        tr__names.appendChild(th_name);

        const th_shop = document.createElement('th');
        th_shop.innerText = 'Название магазина';
        tr__names.appendChild(th_shop);

        const th_price = document.createElement('th');
        th_price.innerText = 'Цена';
        tr__names.appendChild(th_price);

        const th_bonus = document.createElement('th');
        th_bonus.innerText = 'Бонусы';
        tr__names.appendChild(th_bonus);

        const total = document.createElement('th');
        total.innerText = 'Итог';
        tr__names.appendChild(total);

        const tr_fillter = document.createElement('tr');
        tr_fillter.className = 'ext-tr__fillter';
        thead.appendChild(tr_fillter);

        const th_name_fillter = document.createElement('th');
        const th_name_fillter_link = document.createElement('button');
        th_name_fillter_link.className = 'ext-th_name_fillter_link';
        th_name_fillter_link.innerText = 'Сортировать по названию';
        th_name_fillter.appendChild(th_name_fillter_link);
        tr_fillter.appendChild(th_name_fillter);

        const th_shop_fillter = document.createElement('th');
        th_shop_fillter.className = 'ext-th_shop_fillter_link';
        const th_shop_fillter_link = document.createElement('button');
        th_shop_fillter_link.innerText = 'Сортировать по магазину';
        th_shop_fillter.appendChild(th_shop_fillter_link);
        tr_fillter.appendChild(th_shop_fillter);

        const th_price_fillter = document.createElement('th');
        th_price_fillter.innerText = 'Сортировать по Цена';
        tr_fillter.appendChild(th_price_fillter);

        const th_bonus_fillter = document.createElement('th');
        th_bonus_fillter.innerText = 'Сортировать по Бонусам';
        tr_fillter.appendChild(th_bonus_fillter);

        const itog_fillter = document.createElement('th');
        itog_fillter.innerText = 'Сортировать по Итог';
        tr_fillter.appendChild(itog_fillter);

        button.addEventListener('click', () => {
            content.classList.toggle('active');
            if (content.classList.contains('active')) {
                button.innerText = 'Скрыть расширение';
            } else {
                button.innerText = 'Запустить расширение';
            }
            parsingData();
        });

        function parsingData() {
            items.length = 0;
            const catalogItem = document.querySelectorAll('.catalog-item:not(.catalog-item_out-of-stock)');

            catalogItem.forEach((card, index) => {
                const name = card.querySelector('.item-title > a').getAttribute('title');
                const image = card.querySelector('.catalog-item-photo > img:first-child').src;
                const shop_name = card.querySelector('.merchant-info__name').innerText;
                const link = card.querySelector('.item-title .ddl_product_link').href;
                let price = parseInt(card.querySelector('.item-price > span').innerText.replace(/[^\d]/g, '').trim());
                let maxDiscount = 0;

                for (const code in promocode) {
                    const options = promocode[code];

                    for (const option of options) {
                        if (price >= option.price_from && option.discount > maxDiscount) {
                            maxDiscount = option.discount;
                        }
                    }
                }

                const priceWithDiscount = price - maxDiscount;

                const bonus = parseInt(card.querySelector('.bonus-percent').innerText.replace(" ", ""));
                const bonus_total = Math.ceil(price * bonus / 100);

                let total;
                if (priceWhitePromocode__input.checked) {
                    total = priceWithDiscount - bonus_total;
                } else {
                    total = price - bonus_total;
                }

                if (priceWhitePromocode__input.checked) {
                    price = priceWithDiscount
                } else {
                    price = price
                }

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

            const container = document.createElement('div');
            container.classList.add('ext-container');
            tableParent.appendChild(container);
            container.appendChild(content);

            items.forEach((item, index) => {
                item.originalPrice = parseInt(item.price);
                const row = document.createElement("tr");
                const name = document.createElement("td");
                name.classList.add('ext-name');
                const link = document.createElement("a");
                link.textContent = item.product_name;
                link.href = item.product_link;
                link.target = '_blank';
                name.appendChild(link);

                const nameShop = document.createElement("td");
                nameShop.textContent = item.shop_name;
                const price = document.createElement("td");
                price.textContent = item.price;
                const bonus = document.createElement("td");
                bonus.textContent = item.bonus;
                const total = document.createElement("td");
                total.textContent = item.total;

                row.appendChild(name);
                row.appendChild(nameShop);
                row.appendChild(price);
                row.appendChild(bonus);
                row.appendChild(total);
                tbody.appendChild(row);
            });
        }

        const buttonShow = document.createElement('button');
        buttonShow.classList.add('ext-button_show');
        buttonShow.innerText = `Показать товар`;
        tableParent.appendChild(buttonShow);

        buttonShow.addEventListener('click', () => {
            const btnValudate = document.querySelector('.catalog-items-list__show-more');
            if (btnValudate) {
                btnValudate.click();
                count_products.innerText = 'Количество товаров: ' + items.length;
                tbody.innerHTML = ' ';
                items.length = 0;
                parsingData();
            } else {
                console.log('Кнопка не найдена');
            }
        });

        th_name_fillter_link.addEventListener("click", () => {
            items.sort((a, b) => {
                const nameA = a.product_name.toUpperCase();
                const nameB = b.product_name.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });

            tbody.innerHTML = '';
            items.forEach((item, index) => {
                const row = document.createElement("tr");

                const product_name = document.createElement("td");
                product_name.classList.add('ext-name');

                const link = document.createElement("a");
                link.textContent = item.product_name;
                link.href = item.product_link;
                link.target = '_blank';
                product_name.appendChild(link);

                const nameShop = document.createElement("td");
                nameShop.textContent = item.shop_name;
                const price = document.createElement("td");
                price.textContent = item.price;
                const bonus = document.createElement("td");
                bonus.textContent = item.bonus;
                const total = document.createElement("td");
                total.textContent = item.total;

                row.appendChild(product_name);
                row.appendChild(nameShop);
                row.appendChild(price);
                row.appendChild(bonus);
                row.appendChild(total);
                tbody.appendChild(row);
            });
        });

        priceWhitePromocode__input.addEventListener('change', () => {
            const priceWithDiscount = priceWhitePromocode__input.checked;
            tbody.innerHTML = '';
            items.forEach(item => {
                if (priceWithDiscount) {
                    item.price = item.priceWithDiscount;
                } else {
                    // Возвращаем исходные цены, если чекбокс не отмечен
                    item.price = item.originalPrice;
                }
                item.total = calculateTotalPrice(item.price, item.bonus);
            });
            renderItems();
        });
        
        function calculateTotalPrice(price, bonus) {
            return price - bonus;
        }
        
        function renderItems() {
            items.forEach(item => {
                const row = document.createElement("tr");
                const name = document.createElement("td");
                name.classList.add('ext-name');
                const link = document.createElement("a");
                link.textContent = item.product_name;
                link.href = item.product_link;
                link.target = '_blank';
                name.appendChild(link);
        
                const nameShop = document.createElement("td");
                nameShop.textContent = item.shop_name;
                const price = document.createElement("td");
                price.textContent = item.price;
                const bonus = document.createElement("td");
                bonus.textContent = item.bonus;
                const total = document.createElement("td");
                total.textContent = item.total;
        
                row.appendChild(name);
                row.appendChild(nameShop);
                row.appendChild(price);
                row.appendChild(bonus);
                row.appendChild(total);
                tbody.appendChild(row);
            });
        }

        function waitForElementToAppear(selector, callback) {
            const element = selector;
            if (element) {
                callback(element);
            } else {
                setTimeout(() => {
                    waitForElementToAppear(selector, callback);
                }, 100);
            }
        }
    }
});
