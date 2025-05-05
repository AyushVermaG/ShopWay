// cart.js - ShopWay Cart with Reload and Enhanced Product Cards
document.addEventListener('DOMContentLoaded', function() {
    // Cart data structure
    let cart = JSON.parse(localStorage.getItem('shopway_cart')) || [];
    
    // Product database with image placeholders
    const products = {
        'Wireless Headphones': { 
            price: 2499,
            image: 'INSERT_IMAGE_LINK_HERE' 
        },
        'Smart Watch': { 
            price: 3999,
            image: 'INSERT_IMAGE_LINK_HERE'
        },
        'Bluetooth Speaker': { 
            price: 1299,
            image: 'INSERT_IMAGE_LINK_HERE'
        },
        'Smartphone': { 
            price: 15999,
            image: 'INSERT_IMAGE_LINK_HERE'
        },
        'Gaming Laptop': { 
            price: 59999,
            image: 'INSERT_IMAGE_LINK_HERE'
        },
        'Stylish Sneakers': { 
            price: 3499,
            image: 'INSERT_IMAGE_LINK_HERE'
        },
        'Luxury Wristwatch': { 
            price: 8999,
            image: 'INSERT_IMAGE_LINK_HERE'
        },
        'SAMSUNG Family Hub Refrigerator': { 
            price: 359499,
            image: 'INSERT_IMAGE_LINK_HERE'
        }
        // Add all other products similarly...
    };

    // Initialize cart
    updateCartCount();
    renderCart();

    // Public API
    window.shopwayCart = {
        addItem: function(productName) {
            if (products[productName]) {
                cart.push(productName);
                saveAndReload();
            }
        },
        adjustQuantity: function(productName, change) {
            const index = cart.indexOf(productName);
            if (index !== -1 && change < 0) {
                cart.splice(index, 1);
            } else if (change > 0) {
                cart.push(productName);
            }
            saveAndReload();
        },
        removeItem: function(productName) {
            cart = cart.filter(item => item !== productName);
            saveAndReload();
        }
    };

    function saveAndReload() {
        saveCart();
        location.reload(); // Reloads the page after any action
    }

    function saveCart() {
        localStorage.setItem('shopway_cart', JSON.stringify(cart));
    }

    function updateCartCount() {
        const countElement = document.getElementById('cart-count');
        if (countElement) {
            countElement.textContent = cart.length;
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
                </div>`;
            updateTotals();
            return;
        }

        // Group items by product and count quantities
        const groupedItems = cart.reduce((acc, product) => {
            acc[product] = (acc[product] || 0) + 1;
            return acc;
        }, {});

        container.innerHTML = Object.entries(groupedItems).map(([product, quantity]) => `
            <div class="cart-item product-card">
                <div class="product-image">
                    <img src="${products[product]?.image || 'INSERT_DEFAULT_IMAGE_LINK_HERE'}" 
                         alt="${product}" 
                         onerror="this.src='INSERT_DEFAULT_IMAGE_LINK_HERE'">
                </div>
                <div class="product-details">
                    <h3>${product}</h3>
                    <p>₹${products[product]?.price?.toLocaleString('en-IN') || '0'}</p>
                </div>
                <div class="product-controls">
                    <button class="btn quantity-btn" 
                            onclick="shopwayCart.adjustQuantity('${product}', -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${quantity}</span>
                    <button class="btn quantity-btn" 
                            onclick="shopwayCart.adjustQuantity('${product}', 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="btn remove-btn" 
                            onclick="shopwayCart.removeItem('${product}')">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `).join('');

        updateTotals();
    }

    function updateTotals() {
        const subtotal = cart.reduce((total, product) => {
            return total + (products[product]?.price || 0);
        }, 0);
        
        document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
        document.getElementById('total').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    }
});