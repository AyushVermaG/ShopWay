// cart.js - ShopWay Cart with Reload and Enhanced Product Cards
document.addEventListener('DOMContentLoaded', function() {
    // Cart data structure
    let cart = JSON.parse(localStorage.getItem('shopway_cart')) || [];
    
    // Product database with image placeholders
    const products = {
        'Wireless Headphones': { 
            price: 2499,
            image: 'https://img.freepik.com/free-photo/still-life-wireless-cyberpunk-headphones_23-2151072227.jpg?semt=ais_hybrid&w=740' 
        },
        'Smart Watch': { 
            price: 3999,
            image: 'https://www.leafstudios.in/cdn/shop/files/1_1099cd20-7237-4bdf-a180-b7126de5ef3d_grande.png?v=1722230645'
        },
        'Bluetooth Speaker': { 
            price: 1299,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPzO2aUkPx4r1SIu1Q6_GPnQu-XQG-1F8Pow&s'
        },
        'Smartphone': { 
            price: 15999,
            image: 'https://www.lavamobiles.com/_next/image?url=https://hotfixapi.lavamobiles.com/storage/media/community/image/blaze-duo-listing-1733894159.webp&w=640&q=75'
        },
        'Gaming Laptop': { 
            price: 59999,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsmQHmmXbmbrV1o5cKcS3Bqp05T3BuEws-8g&s'
        },
        'Stylish Sneakers': { 
            price: 3499,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9sZJogjpf_auIHgLX5lsbwzJE9MgyA4Az7Q&s'
        },
        'Luxury Wristwatch': { 
            price: 8999,
            image: 'https://images-cdn.ubuy.ci/675a6d12bac4a004d15e4fe3-poedagar-luxury-men-quartz-watch.jpg'
        },
        'SAMSUNG Family Hub Refrigerator': { 
            price: 359499,
            image: 'Ihttps://www.cnet.com/a/img/resize/3be58b218810a0d5ba3c43c20e1eb140b8509bb2/hub/2016/07/15/bda3c418-740a-4183-93fc-3b95d5a1cc58/samsung-family-hub-refrigerator-promo.jpg?auto=webp&width=768'
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
                    <img src="${products[product]?.image || '"C:\scmdot\ShopWay\images\gpt banner.png"'}" 
                         alt="${product}" 
                         onerror="this.src='"C:\scmdot\ShopWay\images\gpt banner.png"'">
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