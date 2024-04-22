import { updateProductCount, updatePageCount } from './updateProductCount.js';

export function parsingData(data_items, productCards, count_page, count_products) {
    productCards = Array.from(document.querySelectorAll('.catalog-item:not(.catalog-item_out-of-stock):not(.catalog-item_banner):not(.catalog-item_banner'));

    if (!productCards) {
        return console.log('Карточек нет');
    }

    if (count_page) {
        count_page.innerText = 'Тещкущая страница: ' + updatePageCount();
    }

    if (count_products) {
        count_products.innerText = 'Количество товаров: ' + updateProductCount(data_items, productCards);
    }


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