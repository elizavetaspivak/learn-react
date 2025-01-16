import './App.css'
import {ShoppingCart} from "./components/ShoppingCart.tsx";
import {Discount, Product, ShippingRule} from "./types/ShoppingCart.ts";

const products: Product[] = [{
    id: '1',
    name: 'product 1',
    price: 1000,
    weight: 30,
    stock: 4,
    image: ''
}, {
    id: '2',
    name: 'product 2',
    price: 2000,
    weight: 30,
    stock: 2,
    image: ''
}, {
    id: '3',
    name: 'product 3',
    price: 100,
    weight: 30,
    stock: 2,
    image: ''
}]

const discounts: Discount[] = [{
    type: 'percentage',
    value: 3,
    code: 'TRX',
}, {
    type: 'fixed',
    value: 20,
    code: 'UYRE'
}]

const shippingRules: ShippingRule[] = [{
    minOrderValue: 1,
    cost: 100
}, {
    minOrderValue: 5,
    cost: 1000
}, {
    minOrderValue: 500,
    cost: 5000
}]

function App() {

    const onSubmit = () => {
        console.log('')
    }

    return (
        <div>
            <ShoppingCart discounts={discounts} taxRate={10} onCheckout={onSubmit} shippingRules={shippingRules}
                          minimumOrderValue={500}
                          products={products}/>
        </div>
    )
}

export default App
