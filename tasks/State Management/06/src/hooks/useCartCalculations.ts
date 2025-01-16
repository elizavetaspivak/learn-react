import {useEffect, useState} from 'react';
import {CartItem, CartTotals, Discount, ShippingRule} from '../types/ShoppingCart';

export const useCartCalculations = (
    items: CartItem[],
    taxRate: number,
    shippingRules: ShippingRule[],
    appliedDiscount?: Discount
) => {
    // TODO: Implement cart calculations
    // 1. Calculate subtotal
    // 2. Apply discount if present
    // 3. Calculate tax
    // 4. Determine shipping cost
    // 5. Calculate total
    // Use useMemo to optimize calculations

    const [subtotal, setSubtotal] = useState(0)
    const [discount, setDiscount] = useState(0)

    useEffect(() => {
        let sub = 0;
        items.forEach((i) => sub = sub + (i.price * i.quantity))
        setSubtotal(sub)
    }, [items])

    useEffect(() => {
        if (appliedDiscount) {
            if (appliedDiscount.type === 'percentage') {
                setDiscount(subtotal / 100 * appliedDiscount.value)
            }

            if (appliedDiscount.type === 'fixed') {

                setDiscount(appliedDiscount.value)
            }
        }
    }, [appliedDiscount])

    const calculateShipping = () => {
        let cost = 0;
        shippingRules.sort((a, b) => b.minOrderValue - a.minOrderValue)

        for (let i = 0; i < shippingRules.length; i++) {
            if (subtotal > shippingRules[i].minOrderValue) {
                cost = shippingRules[i].cost
                break
            }
        }

        return cost
    }

    const shipping = calculateShipping()
    const tax = subtotal / 100 * taxRate

    const total = subtotal - discount + tax + shipping;

    let isValid = false;

    if (total > 0 && subtotal > 0 && tax > 0){
        isValid = true
    }

    const isOutOfStock = items.some(i => i.stock < i.quantity)

    if(isOutOfStock){
        isValid = false
    }

    return {
        totals: {
            subtotal,
            discount,
            tax,
            shipping,
            total,
        } as CartTotals,
        isValid,
    };
};
