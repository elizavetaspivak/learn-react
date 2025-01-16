import React, {useState} from 'react';
import {ShoppingCartProps, CartItem, Discount, Product} from '../types/ShoppingCart';
import {useCartCalculations} from '../hooks/useCartCalculations';

export const ShoppingCart: React.FC<ShoppingCartProps> = ({
                                                              products,
                                                              taxRate,
                                                              shippingRules,
                                                              discounts,
                                                              minimumOrderValue,
                                                              onCheckout,
                                                          }) => {
    // TODO: Implement the component
    // 1. Initialize cart state
    // 2. Create handlers for:
    //    - Adding items
    //    - Updating quantity
    //    - Removing items
    //    - Applying discount
    // 3. Use useCartCalculations for derived state
    // 4. Implement UI for:
    //    - Product list
    //    - Cart items
    //    - Totals
    //    - Discount form
    // 5. Add error handling and validation

    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [discount, setDiscount] = useState<Discount | undefined>()

    const {isValid, totals} = useCartCalculations(cartItems, taxRate, shippingRules, discount)

    const addProductToCart = (product: Product) => {
        if (cartItems.find(c => c.id === product.id)) {
            setCartItems((prevState) => prevState.map(p => p.id === product.id ? {
                ...product,
                quantity: p.quantity + 1
            } : p))
        } else {
            setCartItems([...cartItems, {...product, quantity: 1}])
        }
    }

    const removeProductFromCart = (productId: string) => {
        setCartItems(prevState => prevState.filter(cartItem => cartItem.id !== productId))
    }

    const onChecoutHandler = () => {
        onCheckout && onCheckout(totals, cartItems)
    }

    const onDiscountChange = (code: string) => {
        const discoun = discounts.find(d => d.code === code)

        if (discoun) {
            setDiscount(discoun)
        } else {
            setDiscount(undefined)
        }
    }

    const changeQuantity = (key: 'inc' | 'dec', id: string) => {
        setCartItems(prevState => prevState.map(cartItem => cartItem.id === id ? ({
            ...cartItem,
            quantity: key === 'inc' ? cartItem.quantity + 1 : cartItem.quantity - 1
        }) : cartItem))
    }

    return (
        <div>
            <h2>Shopping Cart</h2>
            <div>
                Cart
                <div>
                    min order value - ${minimumOrderValue}
                </div>
                <div>
                    <div className='discounts'>
                        <label htmlFor="discounts">Discounts</label>
                        <select name="discounts" id="discounts" value={discount ? discount.code : undefined}
                                onChange={e => onDiscountChange(e.currentTarget.value)}>
                            <option value={undefined}>
                                not selected
                            </option>
                            {discounts.map((d) => (<option key={d.code} value={d.code}>
                                {d.code}
                            </option>))}
                        </select>
                    </div>
                </div>
                <div className='cart' role={'cart'} aria-label={'cartitems'}>
                    {cartItems.map(c => (
                        <div key={c.id} role={'elem'} aria-label={'cartelem'}>
                            <div>
                                name - {c.name}
                            </div>
                            <div>
                                price - ${c.price}
                            </div>
                            <div>
                                <button onClick={() => changeQuantity('dec', c.id)}>-</button>
                                <div role={'quantity'} aria-label={'quantity'}>
                                    {c.quantity}
                                </div>
                                <button onClick={() => changeQuantity('inc', c.id)}>+</button>
                            </div>
                            <button onClick={() => removeProductFromCart(c.id)}>Remove</button>
                        </div>
                    ))}
                </div>
                <div>
                    <div>
                        subtotal - ${totals.subtotal}
                    </div>
                    <div>
                        discount - ${totals.discount}
                    </div>
                    <div>
                        tax - ${totals.tax}
                    </div>
                    <div>
                        shipping - ${totals.shipping}
                    </div>
                    <div>
                        total - ${totals.total}
                    </div>
                </div>
                <button onClick={onChecoutHandler} disabled={totals.total < minimumOrderValue || !isValid}>Checkout</button>
            </div>

            <div>
                Products
                <div className='products'>
                    {products.map((p) => (<div className='product' key={p.id}>
                        <div>
                            name - {p.name}
                        </div>
                        <div>
                            stock - {p.stock}
                        </div>
                        <div>
                            weight - {p.weight}
                        </div>
                        <div>
                            price - ${p.price}
                        </div>
                        <div>
                            {p.image}
                        </div>
                        <button onClick={() => addProductToCart(p)}>Add to cart</button>
                    </div>))}
                </div>
            </div>

            {/* TODO: Implement UI */}
        </div>
    );
};
