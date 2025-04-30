// Initialize cart and wishlist from localStorage, or create empty arrays
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Update cart count in header
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Add product to cart
function addToCart(product) {
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to localStorage
    updateCart();
    updateCartCount();
    alert(`${product} added to cart!`);
}

// Update cart UI
function updateCart() {
    const cartSection = document.getElementById("cart");
    if (!cartSection) return;

    if (cart.length === 0) {
        cartSection.innerHTML = "<h2>Your Shopping Cart</h2><p>No items in cart.</p>";
    } else {
        let cartItemsHTML = "<h2>Your Shopping Cart</h2><ul>";
        cart.forEach(item => {
            cartItemsHTML += `<li>${item}</li>`;
        });
        cartItemsHTML += "</ul>";
        cartSection.innerHTML = cartItemsHTML;
    }
}

// Add product to wishlist
function addToWishlist(product) {
    if (!wishlist.includes(product)) {
        wishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlist)); // Save wishlist to localStorage
        alert(`${product} has been added to your wishlist!`);
    } else {
        alert(`${product} is already in your wishlist.`);
    }
}

// Toggle light/dark mode
function toggleMode() {
    const body = document.body;
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    body.classList.toggle('dark');
    body.classList.toggle('light');
    header?.classList.toggle('dark');
    header?.classList.toggle('light');
    footer?.classList.toggle('dark');
    footer?.classList.toggle('light');

    // Persist theme in localStorage
    const currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
}

// Set initial theme based on localStorage
window.onload = () => {
    const savedTheme = localStorage.getItem('theme');
    document.body.classList.add(savedTheme || 'dark');
    updateCartCount();
    updateCart();
};

// Seller dashboard section logic
function showSection(section) {
    const content = document.getElementById('dashboard-content');
    if (!content) return;
    
    let html = "";

    switch(section) {
        case 'add-product':
            html = `
                <h3>Add New Product</h3>
                <label>Product Name: <input type="text" placeholder="e.g., Bluetooth Speaker"></label><br>
                <label>Price: <input type="number" placeholder="e.g., 1299"></label><br>
                <label>Image URL: <input type="text" placeholder="e.g., product.jpg"></label><br>
                <button class="btn">Submit Product</button>
            `;
            break;

        case 'view-orders':
            html = `
                <h3>Order List</h3>
                <p>No recent orders.</p>
            `;
            break;

        case 'manage-products':
            html = `
                <h3>Your Products</h3>
                <ul>
                    <li>Wireless Headphones <button class="btn">Edit</button> <button class="btn">Delete</button></li>
                    <li>Smart Watch <button class="btn">Edit</button> <button class="btn">Delete</button></li>
                </ul>
            `;
            break;

        default:
            html = "<p>Select an option from above.</p>";
    }

    content.innerHTML = html;
}

  const slides = document.querySelectorAll('.hero-slide');
  let current = 0;

  setInterval(() => {
    slides[current].classList.remove('active');

    current = (current + 1) % slides.length;

    slides[current].classList.add('active');
  }, 4000);