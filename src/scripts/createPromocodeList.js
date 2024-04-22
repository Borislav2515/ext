import { createElementBlock, createCheckbox } from './createElement';

export function createPromocodeList(promoServer) {
    const promocodeList = createElementBlock('div', 'promocode-list');

    for (const promocode in promoServer) {
        const promocodeItem = createCheckbox(promocode, promoServer[promocode]);
        promocodeList.appendChild(promocodeItem);
    }
    return promocodeList;
}
