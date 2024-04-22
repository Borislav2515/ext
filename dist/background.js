// Добавляем обработчик события для отслеживания изменений во вкладках
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // Проверяем, что URL изменился и не является пустым
    if (changeInfo.url && !isIntermediateURL(changeInfo.url)) {
        // Отправляем сообщение, когда изменился основной URL
        chrome.tabs.sendMessage(tabId, {
            message: 'url-changed',
            url: changeInfo.url
        });
    }
});

// Функция для проверки, является ли URL промежуточным
function isIntermediateURL(url) {
    // Проверяем, содержит ли URL параметры запроса или хэш
    return url.includes('#');
}

