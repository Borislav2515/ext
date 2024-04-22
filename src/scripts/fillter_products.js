import { shopValidate } from "./shopValidate";
import {createElementBlock, createElementText} from "./createElement";

export function filterProducts(products, tbody, param = 'default') {
        // Копируем массив data_items
        let filteredData = [...products];
    
        // Сортируем массив по выбранному атрибуту
        filteredData.sort((a, b) => {
            if (a[param] < b[param]) return -1;
            if (a[param] > b[param]) return 1;
            return 0;
        });
    
        // Отрисовываем таблицу с отфильтрованными данными
        tabulate(filteredData, tbody);
}

export function filterProductsBonus(products, tbody, param = 'default') {
    // Копируем массив data_items
    let filteredData = [...products];
    
    // Сортируем массив по выбранному атрибуту
    filteredData.sort((a, b) => {
        if (a[param] > b[param]) return -1;
        if (a[param] < b[param]) return 1;
        return 0;
    });

    // Отрисовываем таблицу с отфильтрованными данными
    tabulate(filteredData, tbody);
}

export function tabulate(data, tbody, tr) {
    tbody.innerHTML = '';
    const existingIds = new Set();

    const addRow = (rowData) => {
        const row = document.createElement('tr');
        rowData.forEach(cellData => {
            const cell = document.createElement('td');
            if (typeof cellData === 'string' || typeof cellData === 'number') {
                cell.textContent = cellData.toString();
            } else if (cellData instanceof HTMLElement) {
                cell.appendChild(cellData);
            }
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    };

    data.forEach(product => {
        const { name, namelink, shop, shopLink, price, bonus, total, promocode } = product;
        const id = `${name}-${shop}`; // Используем комбинацию имени и магазина в качестве уникального идентификатора

        if (existingIds.has(id)) {
            return; // Если товар уже существует, пропускаем его
        }
        existingIds.add(id);

        if (promocode === null) {
            const rowData = [
                createLink(namelink, name),
                createLinkShop(namelink, shop),
                price,
                bonus,            
                total,
                '-'
            ];
            addRow(rowData);
        } else {
            const rowData = [
                createLink(namelink, name),
                createLinkShop(namelink, shop),
                price,
                bonus,            
                total,
                promocode
            ];
            addRow(rowData);
        }
        
    });
}

const createLinkShop = (href, text = '') => {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    link.addEventListener('click', (e) => {
        e.preventDefault();
        let color = shopValidate(href);

        if (color) {
            
            link.style.color = color;
        }
    });
    return link;
};

const createLink = (href, text = '') => {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    link.target = '_blank';
    return link;
};


