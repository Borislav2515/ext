export function openTable(promoValActive) {
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
}