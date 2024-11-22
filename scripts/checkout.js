import { cart, removeFromCart } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions } from '../data/deliveryOptions.js';

const today = dayjs();
const deliveryDate = today.add(7, 'days');
console.log(deliveryDate.format('dddd, MMMM D'));

let cartSummaryHTML = '';

cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProduct = products.find(product => product.id === productId);

    cartSummaryHTML += `
    <div class="container js-cart-item-container-${matchingProduct.id}">
        <h2>Your Shopping Cart</h2>
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Remove</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${matchingProduct.name}</td>
                    <td>${cartItem.quantity}</td>
                    <td>$ ${formatCurrency(matchingProduct.priceCents)}</td>
                    <td><button class="remove-btn js-delete-link" data-product-id="${matchingProduct.id}">Remove</button></td>
                </tr>
            </tbody>
        </table>
        <div>
            ${deliveryOptionHTML(cartItem)}
        </div>

        <div class="cart-total">
            <p>Total: $${((matchingProduct.priceCents / 100) * cartItem.quantity).toFixed(2)}</p>

            <button class="checkout-btn"><a href="checkoutpage.html">Proceed to Checkout</a></button>
        </div>
    </div>
    `;
});

function deliveryOptionHTML(cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D');
        const priceString = deliveryOption.priceCents === 0 ? 'Free' : `$${(deliveryOption.priceCents / 100).toFixed(2)}`;

        const checked = deliveryOption.id === cartItem.deliveryOptionId ? 'checked' : '';

        html += `
        <div>
            <p>Choose delivery date</p>
            <input type="radio" id="date-${deliveryOption.id}" name="delivery-option-${cartItem.productId}" value="${deliveryOption.id}" ${checked}>
            <label for="date-${deliveryOption.id}">${dateString}</label>
            <span> ${priceString} Shipping</span><br>
        </div>
        `;
    });

    return html;
}

document.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener('change', (e) => {
        const productId = e.target.name.split('-').pop();
        const selectedOptionId = e.target.value;

        cart.forEach((cartItem) => {
            if (cartItem.productId === productId) {
                cartItem.deliveryOptionId = selectedOptionId;
            }
        });

        saveToStorage();
    });
});

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove();
    });
});
