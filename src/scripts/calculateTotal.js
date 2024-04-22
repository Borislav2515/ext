export function calculateTotal (price, bonus) {
    if (!price || !bonus) {
        return 0;
    }
    let cleanPrice = price;
    let cleanBonus = parseFloat(bonus);
    cleanPrice = parseInt(cleanPrice);
    cleanBonus = parseInt(cleanBonus);
    let bonusValue = cleanPrice * cleanBonus / 100;
    bonusValue = Math.ceil(bonusValue);
    let total = cleanPrice - bonusValue;
    return total;
};