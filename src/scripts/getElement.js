export function getElement(selector) {
    const foundElement = waitForElementToAppear(selector);
    return foundElement

    function waitForElementToAppear(selector) {
        let foundElement = document.querySelector(selector);
        if (foundElement) {
            return foundElement;
        } else {
            const observer = new MutationObserver(mutations => {
                const foundElement = document.querySelector(selector);
                if (foundElement) {
                    observer.disconnect();
                    return foundElement;
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }
    }
}

export function getElements(selector) {
    const foundElements = waitForElementsToAppear(selector);
    const elements = Array.from(document.querySelectorAll(selector));
    if (elements.length > 0) {
        return elements;
    }

    function waitForElementsToAppear(selector) {
        const observer = new MutationObserver(mutations => {
            const elements = Array.from(document.querySelectorAll(selector));
            if (elements.length > 0) {
                observer.disconnect();
                return elements;
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }
}