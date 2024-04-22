window.addEventListener('load', function() {

    const items = [];
    
    setTimeout(() => {
        
        let tableParent = document.querySelector('.catalog-listing-controls');
    
        const root = document.createElement('div');
        const cssUrl = chrome.runtime.getURL('style.css');
        root.innerHTML = `<link rel="stylesheet" href="${cssUrl}">`;
    
        if(!tableParent) {
            return;
        } else {
            tableParent.appendChild(root);
        }
    
        // проверка элемента на странице
        function waitForElementToAppear(selector, callback) {
            const element = selector;
            if (element) {
                callback(element);
            } else {
                setTimeout(function() {
                    waitForElementToAppear(selector, callback);
                }, 100); // Проверяем каждые 100 миллисекунд
            }
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
    
        let table = document.createElement('table');
            let thead = document.createElement('thead');
            let tbody = document.createElement('tbody');
            let tr = document.createElement('tr');
            table.appendChild(thead);
            thead.appendChild(tr);
            table.appendChild(tbody);
            let th_name = document.createElement('th');
            th_name.innerText = 'Название товара';
            tr.appendChild(th_name);
            let th_shop = document.createElement('th');
            th_shop.innerText = 'Название магазина';
            tr.appendChild(th_shop);
            let th_price = document.createElement('th');
            th_price.innerText = 'Цена';
            tr.appendChild(th_price);
            let th_bonus = document.createElement('th');
            th_bonus.innerText = 'Бонусы';
            tr.appendChild(th_bonus);
            let itog = document.createElement('th');
            itog.innerText = 'Итог';
            tr.appendChild(itog);
        
        button.addEventListener('click', () => {
            content.classList.toggle('active');
            if(content.classList.contains('active')) {
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
                waitForElementToAppear(name, function(element) {
                    name = name.getAttribute('title');
                    return name 
                });
    
                let image = card.querySelector('.catalog-item-photo > img:first-child');
                waitForElementToAppear(image, function(element) {
                    image = image.src;
                    return image
                })
        
                let shop_name = card.querySelector('.merchant-info__name');
                waitForElementToAppear(shop_name, function(element) {
                    shop_name = shop_name.innerText;
                    return shop_name
                });
        
                let link = card.querySelector('.item-title .ddl_product_link');
                waitForElementToAppear(link, function(element) {
                    link = link.href;
                    return link
                });
        
                let price = card.querySelector('.item-price > span');
                waitForElementToAppear(price, function(element) {
                    price = price.innerText;
                    let cleanPrice = price.replace(/[^\d]/g, ''); // Удаляем все символы кроме цифр
                    cleanPrice = cleanPrice.trim()
                    price = parseInt(cleanPrice)
                    return price
                });
        
                let bonus = card.querySelector('.bonus-amount');
                waitForElementToAppear(bonus, function(element) {
                    number_without_spaces = bonus.innerText;
                    number_without_spaces = number_without_spaces.replace(" ", "")
                    bonus = parseInt(number_without_spaces)
                    return bonus
                });
        
                let itog = price - bonus;
        
                items.push({
                    Название: name,
                    Продавец: shop_name,
                    Ссылка: link,
                    Цена: price,
                    Бонусы: bonus,
                    Итог: itog,
                    image: image
                });
    
                items.sort((a, b) => a.Итог - b.Итог);
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
                link.textContent = item.Название;
                link.href = item.Ссылка;
                link.target = '_blank';
                name.appendChild(link);
    
                // let imgWrap = document.createElement("span");
                // imgWrap.classList.add('ext-span-img', 'hoverable');
                // imgWrap.setAttribute("data-img", `${item.image}`);
                // imgWrap.innerText = '?';
                // name.appendChild(imgWrap);
    
                let nameShop = document.createElement("td");
                nameShop.textContent = item.Продавец;
    
                let price = document.createElement("td");
                price.textContent = item.Цена;
    
                let bonus = document.createElement("td");
                bonus.textContent = item.Бонусы;
    
                let itog = document.createElement("td");
                itog.textContent = item.Итог;
    
                row.appendChild(name);
                row.appendChild(nameShop);
                row.appendChild(price);
                row.appendChild(bonus);
                row.appendChild(itog);
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
    
    
        
    
    }, "5000");
      
    });