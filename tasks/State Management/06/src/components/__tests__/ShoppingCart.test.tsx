import {render, screen, fireEvent} from '@testing-library/react';
import {ShoppingCart} from '../ShoppingCart';
import {Product, ShippingRule, Discount} from '../../types/ShoppingCart';
import {describe, expect, it } from 'vitest';

describe('ShoppingCart', () => {
    const mockProducts: Product[] = [
        {id: '1', name: 'Product 1', price: 10, weight: 1, stock: 5},
        {id: '2', name: 'Product 2', price: 20, weight: 2, stock: 3},
    ];

    const mockShippingRules: ShippingRule[] = [
        {minOrderValue: 0, cost: 5},
        {minOrderValue: 50, cost: 0},
    ];

    const mockDiscounts: Discount[] = [
        {type: 'percentage', value: 10, code: 'SAVE10'},
        {type: 'fixed', value: 5, code: 'MINUS5'},
    ];

    const defaultProps = {
        products: mockProducts,
        taxRate: 0.1,
        shippingRules: mockShippingRules,
        discounts: mockDiscounts,
        minimumOrderValue: 10,
    };

    it('renders empty cart', () => {
        render(<ShoppingCart discounts={defaultProps.discounts} minimumOrderValue={defaultProps.minimumOrderValue}
                             products={defaultProps.products} shippingRules={defaultProps.shippingRules}
                             taxRate={defaultProps.taxRate}/>);

        const tablist = screen.getByRole('cart', {name: /cartitems/i});
        expect(tablist).toBeEmptyDOMElement();
        // TODO: Test initial render
    });

    it('adds product to cart', async () => {
        render(<ShoppingCart discounts={defaultProps.discounts} minimumOrderValue={defaultProps.minimumOrderValue}
                             products={defaultProps.products} shippingRules={defaultProps.shippingRules}
                             taxRate={defaultProps.taxRate}/>);

        const addButtons = screen.getAllByRole('button', {name: /Add to cart/i});
        fireEvent.click(addButtons[0]);
        fireEvent.click(addButtons[1]);

        const cartItems = screen.getAllByRole('elem', {name: /cartelem/i});
        expect(cartItems.length).toBe(2);
        // TODO: Test adding product
    });

    it('updates product quantity', async () => {
        render(<ShoppingCart discounts={defaultProps.discounts} minimumOrderValue={defaultProps.minimumOrderValue}
                             products={defaultProps.products} shippingRules={defaultProps.shippingRules}
                             taxRate={defaultProps.taxRate}/>);
        const addButtons = screen.getAllByText('Add to cart');
        fireEvent.click(addButtons[0]);

        const cartItems = screen.getAllByRole('elem', {name: /cartelem/i});
        expect(cartItems.length).toBe(1);

        const incrementButton = screen.getByText('+');
        fireEvent.click(incrementButton);

        const incrementedQuantity = screen.getByRole('quantity', { name: /quantity/i });
        expect(incrementedQuantity).toHaveTextContent('2');

        const decrementButton = screen.getByText('-');
        fireEvent.click(decrementButton);

        const revertedQuantity = screen.getByRole('quantity', { name: /quantity/i });
        expect(revertedQuantity).toHaveTextContent('1');
        // TODO: Test quantity update
    });

    it('removes product from cart', async () => {
        render(<ShoppingCart discounts={defaultProps.discounts} minimumOrderValue={defaultProps.minimumOrderValue}
                             products={defaultProps.products} shippingRules={defaultProps.shippingRules}
                             taxRate={defaultProps.taxRate}/>);

        const addButtons = screen.getAllByText('Add to cart');
        fireEvent.click(addButtons[0]);

        const cartItems = screen.getAllByRole('elem', {name: /cartelem/i});
        expect(cartItems.length).toBe(1);

        const removeButton = screen.getByText('Remove');
        fireEvent.click(removeButton);

        const tablist = screen.getByRole('cart', {name: /cartitems/i});
        expect(tablist).toBeEmptyDOMElement();

        // TODO: Test product removal
    });

    it('applies percentage discount', async () => {
        render(<ShoppingCart discounts={defaultProps.discounts} minimumOrderValue={defaultProps.minimumOrderValue}
                             products={defaultProps.products} shippingRules={defaultProps.shippingRules}
                             taxRate={defaultProps.taxRate}/>);

        const addButtons = screen.getAllByText('Add to cart');
        fireEvent.click(addButtons[0]);

        const cartItems = screen.getAllByRole('elem', {name: /cartelem/i});
        expect(cartItems.length).toBe(1);

        fireEvent.change(screen.getByLabelText(/discounts/i), {target: {value: 'SAVE10'}});

        const removeButton = screen.getByText('discount - $1');
        expect(removeButton).toBeInTheDocument();

        // TODO: Test percentage discount
    });

    it('applies fixed discount', async () => {
        render(<ShoppingCart discounts={defaultProps.discounts} minimumOrderValue={defaultProps.minimumOrderValue}
                             products={defaultProps.products} shippingRules={defaultProps.shippingRules}
                             taxRate={defaultProps.taxRate}/>);

        const addButtons = screen.getAllByText('Add to cart');
        fireEvent.click(addButtons[0]);

        const cartItems = screen.getAllByRole('elem', {name: /cartelem/i});
        expect(cartItems.length).toBe(1);

        fireEvent.change(screen.getByLabelText(/discounts/i), {target: {value: 'MINUS5'}});

        const removeButton = screen.getByText('discount - $5');
        expect(removeButton).toBeInTheDocument();
        // TODO: Test fixed discount
    });

    it('calculates shipping cost', async () => {
        render(<ShoppingCart discounts={defaultProps.discounts} minimumOrderValue={defaultProps.minimumOrderValue}
                             products={defaultProps.products} shippingRules={defaultProps.shippingRules}
                             taxRate={defaultProps.taxRate}/>);

        const addButtons = screen.getAllByText('Add to cart');
        fireEvent.click(addButtons[0]);

        const cartItems = screen.getAllByRole('elem', {name: /cartelem/i});
        expect(cartItems.length).toBe(1);

        fireEvent.change(screen.getByLabelText(/discounts/i), {target: {value: 'MINUS5'}});

        const removeButton = screen.getByText('total - $10.01');
        expect(removeButton).toBeInTheDocument();
        // TODO: Test shipping calculation
    });

    it('calculates tax correctly', async () => {
        render(<ShoppingCart discounts={defaultProps.discounts} minimumOrderValue={defaultProps.minimumOrderValue}
                             products={defaultProps.products} shippingRules={defaultProps.shippingRules}
                             taxRate={defaultProps.taxRate}/>);

        const addButtons = screen.getAllByText('Add to cart');
        fireEvent.click(addButtons[0]);
        fireEvent.click(addButtons[1]);

        const removeButton = screen.getByText('tax - $0.03');
        expect(removeButton).toBeInTheDocument();
        // TODO: Test tax calculation
    });

    it('enforces minimum order value', async () => {
        render(<ShoppingCart discounts={defaultProps.discounts} minimumOrderValue={20}
                             products={defaultProps.products} shippingRules={defaultProps.shippingRules}
                             taxRate={defaultProps.taxRate}/>);
        const addButtons = screen.getAllByText('Add to cart');
        fireEvent.click(addButtons[0]);

        const checkoutButton = screen.getByText('Checkout');

        expect(checkoutButton).toBeDisabled()

        // TODO: Test minimum order
    });

    it('handles out of stock products', async () => {
        render(<ShoppingCart discounts={defaultProps.discounts} minimumOrderValue={10}
                             products={defaultProps.products} shippingRules={defaultProps.shippingRules}
                             taxRate={defaultProps.taxRate}/>);

        const addButtons = screen.getAllByText('Add to cart');
        fireEvent.click(addButtons[0]);

        const incrementButton = screen.getByText('+');
        fireEvent.click(incrementButton);
        fireEvent.click(incrementButton);
        fireEvent.click(incrementButton);
        fireEvent.click(incrementButton);
        fireEvent.click(incrementButton);

        const checkoutButton = screen.getByText('Checkout');

        expect(checkoutButton).toBeDisabled()

        // TODO: Test stock handling
    });
});
