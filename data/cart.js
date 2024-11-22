export let cart = JSON.parse(localStorage.getItem('cart'));
if (!cart) {
    cart = [
        {
            productId: 'Puma-Men-Big-Logo-Hoodie',
            quantity: 2,
            deliveryOptionId: '1'
        },
        {
            productId: 'BMW-Men-Hoodie',
            quantity: 1,
            deliveryOptionId: '2'
        }
    ];
}

function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantity = 1) {
    let matchingItem = cart.find(cartItem => cartItem.productId === productId);

    if (matchingItem) {
        matchingItem.quantity += quantity;
    } else {
        cart.push({
            productId: productId,
            quantity: quantity,
            deliveryOptionId: '1' // Default delivery option
        });
    }

    saveToStorage();
}

export function removeFromCart(productId) {
    cart = cart.filter(cartItem => cartItem.productId !== productId);
    saveToStorage();
}

export function updateCartQuantity() {
    let cartQuantity = 0;
    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    });
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', function() {
        const productId = this.dataset.productId;
        const quantityInputId = this.dataset.quantityInput;
        const quantity = parseInt(document.getElementById(quantityInputId).value, 10);

        if (quantity > 0) {
            addToCart(productId, quantity);
        } else {
            alert("Please enter a valid quantity.");
        }
    });
});
