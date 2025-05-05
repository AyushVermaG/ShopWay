// cart.js - ShopWay Cart Management System

// Cart Data Structure
let cart = JSON.parse(localStorage.getItem('shopwayCart')) || [];

// DOM Elements
const cartItemsContainer = document.querySelector('.cart-items');
const emptyCartMessage = document.getElementById('empty-cart-message');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');
const checkoutButton = document.getElementById('checkout-btn');
const cartCountElement = document.getElementById('cart-count');

// Product Data (replace with your actual product data)
const products = {
    'Wireless Headphones': { price: 2499 },
    'Smart Watch': { price: 3999 },
    'Bluetooth Speaker': { price: 1299 },
    'Smartphone': { price: 15999 },
    'Gaming Laptop': { price: 59999 },
    'Stylish Sneakers': { price: 3499 },
    'Luxury Wristwatch': { price: 8999 },
    'SAMSUNG Family Hub Refrigerator': { price: 359499 }
};

// Initialize Cart
function initCart() {
    updateCartDisplay();
    updateCartCount();
    
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }
}

// Update Cart Display
function updateCartDisplay() {
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        showEmptyCart();
        return;
    }

    const cartItems = groupCartItems();
    renderCartItems(cartItems);
    updateCartTotals();
}

// Group items by product and count quantities
function groupCartItems() {
    return cart.reduce((grouped, productName) => {
        if (!grouped[productName]) {
            grouped[productName] = {
                name: productName,
                quantity: 0,
                price: products[productName]?.price || 0
            };
        }
        grouped[productName].quantity++;
        return grouped;
    }, {});
}

// Render cart items to DOM
function renderCartItems(items) {
    emptyCartMessage.style.display = 'none';
    
    cartItemsContainer.innerHTML = Object.values(items).map(item => `
        <div class="cart-item" data-product="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>₹${item.price.toLocaleString()}</p>
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="adjustQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="adjustQuantity('${item.name}', 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeItem('${item.name}')">
                    Remove
                </button>
            </div>
        </div>
    `).join('');
}

// Update cart totals
function updateCartTotals() {
    const subtotal = calculateSubtotal();
    subtotalElement.textContent = `₹${subtotal.toLocaleString()}`;
    totalElement.textContent = `₹${subtotal.toLocaleString()}`;
}

// Calculate subtotal
function calculateSubtotal() {
    return cart.reduce((total, productName) => {
        return total + (products[productName]?.price || 0);
    }, 0);
}

// Show empty cart message
function showEmptyCart() {
    emptyCartMessage.style.display = 'block';
    cartItemsContainer.innerHTML = '';
    subtotalElement.textContent = '₹0';
    totalElement.textContent = '₹0';
    
    if (checkoutButton) {
        checkoutButton.disabled = true;
    }
}

// Adjust product quantity
function adjustQuantity(productName, change) {
    const index = cart.indexOf(productName);
    
    if (index !== -1 && change < 0) {
        cart.splice(index, 1);
    } else if (change > 0) {
        cart.push(productName);
    }
    
    saveCart();
    updateCartDisplay();
    updateCartCount();
}

// Remove all instances of a product
function removeItem(productName) {
    cart = cart.filter(item => item !== productName);
    saveCart();
    updateCartDisplay();
    updateCartCount();
}

// Update cart count in header
function updateCartCount() {
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert(`Proceeding to checkout with ${cart.length} items. Total: ${totalElement.textContent}`);
    // In a real app, redirect to checkout page
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('shopwayCart', JSON.stringify(cart));
}

// Public API for other pages
window.ShopWayCart = {
    addItem: function(productName) {
        if (products[productName]) {
            cart.push(productName);
            saveCart();
            updateCartCount();
            return true;
        }
        return false;
    },
    getCount: function() {
        return cart.length;
    },
    getItems: function() {
        return [...cart];
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCart);