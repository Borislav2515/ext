// карточка товара
const productCardsArr = '.catalog-items-list > div:not(.catalog-item_out-of-stock):not(.catalog-item_banner):not(.catalog-item_banner';
// название товара
const name = '.catalog-item-regular-desktop__main-info > a.ddl_product_link';
// ссылка на товар
const nameLink = '.catalog-item-regular-desktop__main-info > a.ddl_product_link';
// название магазина
const shop = '.merchant-info__name';
// ссылка на магазин
const shopLink = '.catalog-item__merchant-info';
// цена товара
const price = '.catalog-item-regular-desktop__price';
// бонусы
const bonusPercent = '.bonus-percent';
// кнопка пагинации
const btnMoreProduct = '.catalog-items-list__show-more';
// родительский элемент куда все встраивать
const parent = '.catalog-listing-controls';