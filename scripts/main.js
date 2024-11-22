import { cart, addToCart } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';

// Hero Section Image changer
const heroImages = [
    'herosection_images/image2.jpg',
    'herosection_images/image3.jpg',
    'herosection_images/image4.jpg',
    'herosection_images/image5.jpg',
];

const heroImgBox = document.querySelector('.js-hero-image');
let currentIndex = 0;

function changeImages() {
    heroImgBox.src = heroImages[currentIndex];
    currentIndex = (currentIndex + 1) % heroImages.length;
}

function start() {
    setInterval(changeImages, 2000);
}

start();

let productsHTML = '';

products.forEach((product) => {
    productsHTML += `
    <div class="product">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$ ${formatCurrency(product.priceCents)}</p>
        <div class="quantity-container">
            <label for="quantity-${product.id}">Quantity:</label>
            <input type="number" id="quantity-${product.id}" class="product-qty" name="quantity" min="1" value="1">
        </div>
        <button class="js-add-to-cart" 
                data-product-id="${product.id}" 
                data-quantity-input="quantity-${product.id}">Add to Cart</button>
    </div>
    `;
});

document.querySelector('.js-products-grid').innerHTML = productsHTML;

function updateCartQuantity() {
    let cartQuantity = 0;
    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    });
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const quantityInputId = button.dataset.quantityInput;
        const quantity = parseInt(document.getElementById(quantityInputId).value, 10);

        if (quantity > 0) {
            addToCart(productId, quantity);
            updateCartQuantity();
        } else {
            alert("Please enter a valid quantity.");
        }
    });
});
