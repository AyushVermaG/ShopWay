// cart.js - Complete ShopWay Cart Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Cart data structure
    let cart = JSON.parse(localStorage.getItem('shopway_cart')) || [];
    
    // Product database (replace with your actual products)
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

    // Initialize cart
    initCart();

    // Public API
    window.shopwayCart = {
        addItem: function(productName) {
            if (products[productName]) {
                cart.push(productName);
                saveCart();
                updateCartCount();
                if (window.location.pathname.includes('cart.html')) {
                    renderCart();
                }
                return true;
            }
            return false;
        },
        getCartCount: function() {
            return cart.length;
        }
    };

    // Core functions
    function initCart() {
        updateCartCount();
        if (window.location.pathname.includes('cart.html')) {
            renderCart();
            setupEventListeners();
        }
    }

    function renderCart() {
        const container = document.querySelector('.cart-items');
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = `
                <div id="empty-cart-message">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="shopway.html" class="btn">Continue Shopping</a>
                </div>
            `;
            updateTotals();
            return;
        }

        // Group items by product and count quantities
        const groupedItems = cart.reduce((acc, productName) => {
            if (!acc[productName]) {
                acc[productName] = {
                    name: productName,
                    quantity: 0,
                    price: products[productName]?.price || 0
                };
            }
            acc[productName].quantity++;
            return acc;
        }, {});

        // Render cart items
        container.innerHTML = Object.values(groupedItems).map(item => `
            <div class="cart-item" data-product="${item.name}">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p>₹${item.price.toLocaleString('en-IN')}</p>
                </div>
                <div class="item-controls">
                    <button class="quantity-btn minus">−</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus">+</button>
                    <button class="remove-btn">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `).join('');

        updateTotals();
    }

    function setupEventListeners() {
        document.querySelectorAll('.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const productName = this.closest('.cart-item').dataset.product;
                updateQuantity(productName, -1);
            });
        });

        document.querySelectorAll('.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const productName = this.closest('.cart-item').dataset.product;
                updateQuantity(productName, 1);
            });
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productName = this.closest('.cart-item').dataset.product;
                removeItem(productName);
            });
        });

        document.getElementById('checkout-btn')?.addEventListener('click', function() {
            if (cart.length > 0) {
                alert(`Proceeding to checkout. Total: ₹${calculateTotal().toLocaleString('en-IN')}`);
                // In real implementation, redirect to checkout page
            } else {
                alert('Your cart is empty!');
            }
        });
    }

    function updateQuantity(productName, change) {
        const index = cart.indexOf(productName);
        if (index !== -1 && change < 0) {
            cart.splice(index, 1);
        } else if (change > 0) {
            cart.push(productName);
        }
        saveCart();
        renderCart();
        updateCartCount();
    }

    function removeItem(productName) {
        cart = cart.filter(item => item !== productName);
        saveCart();
        renderCart();
        updateCartCount();
    }

    function calculateTotal() {
        return cart.reduce((total, productName) => {
            return total + (products[productName]?.price || 0);
        }, 0);
    }

    function updateTotals() {
        const total = calculateTotal();
        document.getElementById('subtotal').textContent = `₹${total.toLocaleString('en-IN')}`;
        document.getElementById('total').textContent = `₹${total.toLocaleString('en-IN')}`;
    }

    function updateCartCount() {
        const countElement = document.getElementById('cart-count');
        if (countElement) {
            countElement.textContent = cart.length;
        }
    }

    function saveCart() {
        localStorage.setItem('shopway_cart', JSON.stringify(cart));
    }
});