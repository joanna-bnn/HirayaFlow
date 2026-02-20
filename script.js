const products = {
    groceries: [
        { id: 1, name: "Rice", price: 50 },
        { id: 2, name: "Milk", price: 60 },
        { id: 3, name: "Pork (1kg)", price: 250 },
        { id: 4, name: "Chicken (1kg)", price: 200 }


    ],
    beauty: [
        { id: 5, name: "Lipstick", price: 300 },
        { id: 6, name: "Perfume", price: 600 },
        { id: 7, name: "Eyeshadow", price: 150 },
        { id: 8, name: "Sunscreen", price: 200 }

    ],
    men: [
        { id: 9, name: "T-Shirt", price: 500 },
        { id: 10, name: "Shoes", price: 1500 },
        { id: 11, name: "Cap", price: 250 },
        { id: 12, name: "Jacket", price: 1000 }

    ],
    women: [
        { id: 13, name: "Dress", price: 800 },
        { id: 14, name: "Handbag", price: 1300 },
        { id: 15, name: "Cardigan", price: 400 },
        { id: 16, name: "Heels", price: 3000 }

    ]
};

let cart = [];

function goHome() {
    document.getElementById("content").innerHTML = `
        <h2>Welcome to HirayaFlow</h2>
        <p>Select a category to start shopping.</p>
    `;
}

goHome();

function showCategory(category) {
    const content = document.getElementById("content");

    content.innerHTML = `<h2>${category.toUpperCase()}</h2><hr>`;

    products[category].forEach(product => {
        content.innerHTML += `
            <div class="product-card">
                <h3>${product.name}</h3>
                <p>₱${product.price}</p>
                <button onclick="addToCart(${product.id}, '${category}')">
                    Add to Cart
                </button>
            </div>
        `;
    });
}

function addToCart(id, category) {
    const product = products[category].find(p => p.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({...product, quantity: 1 });
    }

    updateCartCount();
}

function showCart() {
    const content = document.getElementById("content");

    content.innerHTML = "<h2>Your Cart</h2><hr>";

    if (cart.length === 0) {
        content.innerHTML += "<p>Cart is empty.</p>";
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        content.innerHTML += `
            <p>
                ${item.name}
                <button onclick="decreaseQty(${item.id})">-</button>
                ${item.quantity}
                <button onclick="increaseQty(${item.id})">+</button>
                = ₱${subtotal}
                <button onclick="removeItem(${item.id})">Remove</button>
            </p>
        `;
    });

    content.innerHTML += `<h3>Total: ₱${total}</h3>`;
    content.innerHTML += `<button onclick="checkout(${total})">Checkout</button>`;
}

function increaseQty(id) {
    const item = cart.find(i => i.id === id);
    item.quantity++;
    showCart();
    updateCartCount();
}

function decreaseQty(id) {
    const item = cart.find(i => i.id === id);
    if (item.quantity > 1) {
        item.quantity--;
    }
    showCart();
    updateCartCount();
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    showCart();
    updateCartCount();
}

function updateCartCount() {
    document.getElementById("cartCount").innerText =
        cart.reduce((sum, item) => sum + item.quantity, 0);
}

function checkout(total) {
    let modal = `
        <div class="modal">
            <div class="modal-content">
                <h2>Receipt</h2>
    `;

    cart.forEach(item => {
        modal += `<p>${item.name} x ${item.quantity}</p>`;
    });

    modal += `
                <h3>Total: ₱${total}</h3>
                <button onclick="closeModal()">Close</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modal);
    cart = [];
    updateCartCount();
}

function closeModal() {
    document.querySelector(".modal").remove();
    goHome();
}

function showContact() {
    document.getElementById("content").innerHTML = `
        <h2>Contact Us</h2>
        <p>Email: support@hirayaflow.com</p>
        <p>Phone: 0912-345-6789</p>
    `;
}