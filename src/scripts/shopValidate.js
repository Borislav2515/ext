export async function shopValidate(link) {
    try {
        // Отправка GET-запроса к ссылке
        const response = await fetch(link);
        
        // Проверка на успешный ответ
        if (!response.ok) {
            throw new Error("Ошибка при выполнении перехода: " + response.status);
        }

        // Получение текста ответа
        const html = await response.text();
        
        // Создание временного элемента для парсинга HTML
        const tempElement = document.createElement('div');
        tempElement.innerHTML = html;

        // Поиск элемента, на который нужно выполнить клик
        let elementToClick = tempElement.querySelector('.pdp-merchant-rating-block__rating');

        // Получение текстового содержимого элемента и его преобразование в число
        elementToClick = parseFloat(elementToClick.innerText.replace(/\s+/g, ''));

        // Определение цвета в зависимости от значения elementToClick
        if (elementToClick === 4.1) {
            return 'red';
        } else if (elementToClick < 4 && elementToClick >= 3) {
            return 'yellow';
        } else {
            return 'red'; // Возвращаем 'red' по умолчанию для других случаев
        }
    } catch (error) {
        console.error("Ошибка при выполнении перехода:", error);
    }
}


function waitForElement(selector) {
    return new Promise((resolve) => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                    const addedNode = mutation.addedNodes[0];
                    if (addedNode.nodeType === 1 && addedNode.matches(selector)) {
                        observer.disconnect();
                        console.log('Элемент найден функция ожидания');
                        resolve();
                    }
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
}
