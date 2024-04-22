export function updateProductCount(productCards) {
    if (productCards.length === 0) {
       let productCardsArr = Array.from(document.querySelectorAll('.catalog-item:not(.catalog-item_out-of-stock):not(.catalog-item_banner):not(.catalog-item_banner'));
        return 'Количество товаров: ' + productCardsArr.length
    } else {
        return 'Количество товаров: ' + productCards.length 
    }
}

export function updatePageCount() {
    let params = (new URL(document.location)); 
        params = params.href;
        let match = '';
        if (params) {
            match = params.match(/page-(\d+)/);
        } else {
            return;
        }
        
        if (match) {
            return 'Текущая страница: ' + match[1];
        } else {
            return 'Текущая страница: 1';
        }
}

export function updatePageCountInt() {
    let params = (new URL(document.location)); 
    params = params.href;
    let match = '';
    if (params) {
        match = params.match(/page-(\d+)/);
    } else {
        return;
    }
    
    if (match) {
        return parseInt(match[1]);
    } else {
        return 1;
    }
}