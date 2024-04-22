export function getBestDiscount(price, promocodes, value) {
    let bestDiscount = 0;
    let bestPromo = null;
   
    for (const promoName in promocodes) {
        const promoArray = promocodes[promoName];
        for (const promo of promoArray) {
            if (price >= promo.price_to && promo.discount > bestDiscount) {
                bestDiscount = promo.discount;
                bestPromo = promoName;
            }
        }
    }
    
    if (value === "price") {
        return price - bestDiscount;
    } else if (value === "promo") {
        return bestPromo;
    }
}