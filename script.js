const products = {
    groceries: [
        { id: 1, name: "Rice", price: 50, image: "image/rice.png" },
        { id: 2, name: "Milk", price: 60, image: "image/milk.png" },
        { id: 3, name: "Pork (1kg)", price: 250, image: "image/pork.png" },
        { id: 4, name: "Chicken (1kg)", price: 200, image: "image/chicken.png" }
    ],
    beauty: [
        { id: 5, name: "Lipstick", price: 300, image: "image/lipstick.png" },
        { id: 6, name: "Perfume", price: 600, image: "image/perfume.png" },
        { id: 7, name: "Eyeshadow", price: 150, image: "image/eyeshadow.png" },
        { id: 8, name: "Sunscreen", price: 200, image: "image/sunscreen.png" }
    ],
    men: [
        { id: 9, name: "T-Shirt", price: 500, image: "image/tshirt.png" },
        { id: 10, name: "Shoes", price: 1500, image: "image/shoes.png" },
        { id: 11, name: "Cap", price: 250, image: "image/cap.png" },
        { id: 12, name: "Jacket", price: 1000, image: "image/jacket.png" }
    ],
    women: [
        { id: 13, name: "Dress", price: 800, image: "image/dress.png" },
        { id: 14, name: "Handbag", price: 1300, image: "image/handbag.png" },
        { id: 15, name: "Cardigan", price: 400, image: "image/cardigan.png" },
        { id: 16, name: "Heels", price: 3000, image: "image/heels.png" }
    ]
};

let cart = [];
let studentDiscountActive = false;

function goHome() {
    document.getElementById("content").innerHTML = `
        <h2>Welcome to HirayaFlow</h2>
        <p>Select a category to start shopping.</p>
    `;
}

goHome();

function showCategory(category) {

    const content = document.getElementById("content");

    content.innerHTML = `
        <h2>${category.toUpperCase()}</h2>
        <hr>
        <div class="product-grid"></div>
    `;

    const grid = document.querySelector(".product-grid");

    products[category].forEach(product => {

        grid.innerHTML += `
            <div class="product-card">

                <img src="${product.image}" class="product-image">

                <h3>${product.name}</h3>

                <p>₱${product.price}</p>

                <button onclick="addToCart(${product.id}, '${category}')">
                    ADD TO CART
                </button>

            </div>
        `;
    });
}

function addToCart(id, category) {

    const product = products[category].find(p => p.id === id);

    const existing = cart.find(item => item.id === id);

    if (existing)
        existing.quantity++;
    else
        cart.push({...product, quantity: 1 });

    updateCartCount();
}

function calculateTotals() {

    let subtotal = 0;
    let buy2Get1Discount = 0;

    cart.forEach(item => {

        subtotal += item.price * item.quantity;

        let free = Math.floor(item.quantity / 3);

        buy2Get1Discount += free * item.price;
    });

    let afterBuy2 = subtotal - buy2Get1Discount;

    let autoDiscount = afterBuy2 > 1000 ? afterBuy2 * 0.15 : 0;

    let afterAuto = afterBuy2 - autoDiscount;

    let studentDiscount = studentDiscountActive ? afterAuto * 0.05 : 0;

    let finalTotal = afterAuto - studentDiscount;

    return {
        subtotal,
        buy2Get1Discount,
        autoDiscount,
        studentDiscount,
        finalTotal
    };
}

function showCart() {

    const content = document.getElementById("content");

    content.innerHTML = "<h2>Your Cart</h2><hr>";

    if (cart.length === 0) {
        content.innerHTML += "<p>Cart is empty.</p>";
        return;
    }

    cart.forEach(item => {

        content.innerHTML += `
            <p>
                ${item.name}
                <button onclick="decreaseQty(${item.id})">-</button>
                ${item.quantity}
                <button onclick="increaseQty(${item.id})">+</button>
                = ₱${item.price * item.quantity}
                <button onclick="removeItem(${item.id})">Remove</button>
            </p>
        `;
    });

    const totals = calculateTotals();

    content.innerHTML += `

        <hr>

        <p>Subtotal: ₱${totals.subtotal.toFixed(2)}</p>

        <p>Buy 2 Get 1 Discount: −₱${totals.buy2Get1Discount.toFixed(2)}</p>

        <p>Auto 15% Discount: −₱${totals.autoDiscount.toFixed(2)}</p>

        <p>Student Discount: −₱${totals.studentDiscount.toFixed(2)}</p>

        <h3>Total: ₱${totals.finalTotal.toFixed(2)}</h3>

        <hr>

        <input type="text" id="studentID" placeholder="Enter Student ID">

        <button onclick="applyStudentDiscount()">Apply Student Discount</button>

        <hr>

        <h3>Checkout Information</h3>

        <input type="text" id="customerName" placeholder="Full Name"><br><br>

        <input type="text" id="customerAddress" placeholder="Address"><br><br>

        <input type="text" id="customerPhone" placeholder="Cellphone Number"><br><br>

        <textarea id="customerNote" placeholder="Note to Seller"></textarea><br><br>

        <h3>Payment Method</h3>

        <select id="paymentMethod">

            <option value="GCash">GCash</option>

            <option value="Cash on Delivery">Cash on Delivery</option>

        </select>

        <br><br>

        <button onclick="checkout()">PLACE ORDER</button>
    `;
}

function applyStudentDiscount() {

    const id = document.getElementById("studentID").value.trim();

    if (id.length >= 5) {

        studentDiscountActive = true;

        alert("Student discount applied ✅");

    } else {

        alert("Invalid Student ID ❌");
    }

    showCart();
}

function checkout() {

    const name = document.getElementById("customerName").value;
    const address = document.getElementById("customerAddress").value;
    const phone = document.getElementById("customerPhone").value;
    const note = document.getElementById("customerNote").value;
    const payment = document.getElementById("paymentMethod").value;

    if (!name || !address || !phone) {

        alert("Please fill required fields");

        return;
    }

    const totals = calculateTotals();

    let modal = `
        <div class="modal">
            <div class="modal-content">

                <h2>Receipt</h2>

                <p>Name: ${name}</p>

                <p>Address: ${address}</p>

                <p>Phone: ${phone}</p>

                <p>Note: ${note}</p>

                <p>Payment: ${payment}</p>

                <hr>
    `;

    cart.forEach(item => {

        modal += `<p>${item.name} x ${item.quantity}</p>`;
    });

    modal += `
        <hr>

        <h3>Total: ₱${totals.finalTotal.toFixed(2)}</h3>

        <button onclick="closeModal()">Close</button>

        </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modal);

    cart = [];

    studentDiscountActive = false;

    updateCartCount();
}

function closeModal() {

    document.querySelector(".modal").remove();

    goHome();
}

function increaseQty(id) {

    cart.find(i => i.id === id).quantity++;

    showCart();

    updateCartCount();
}

function decreaseQty(id) {

    let item = cart.find(i => i.id === id);

    if (item.quantity > 1)
        item.quantity--;

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

function showContact() {

    document.getElementById("content").innerHTML = `

        <h2>Contact Us</h2>

        <p>Email: support@hirayaflow.com</p>

        <p>Phone: 0912‑345‑6789</p>

        <p>Facebook: HirayaFlow PH</p>

    `;
}