export function loadMoreProducts() {
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