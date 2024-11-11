// Product Data
const products = [
    { id: 1, name: "Apple AirPods", price: 189.99 },
    { id: 2, name: "Apple iPhone", price: 1200.00 },
    { id: 3, name: "Dell Laptop", price: 1600.00 },
    { id: 4, name: "Acer LED Monitor", price: 230.50 },
    { id: 5, name: "ASUS Keyboard", price: 62.00 }
];

// Function to update the cart display
function updateCart() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');

    cartContainer.innerHTML = ''; // Clear existing items
    let total = 0;

    cartItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${item.name}</td>
      <td>$${item.price}</td>
      <td><input type="number" class="form-control w-25" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)"></td>
      <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Remove</button></td>
    `;
        cartContainer.appendChild(row);
        total += item.price * item.quantity;
    });

    // Show total price
    if (cartItems.length > 0) {
        const totalRow = document.createElement('tr');
        totalRow.innerHTML = `
      <td colspan="3" class="text-end"><strong>Total:</strong></td>
      <td><strong>$${total.toFixed(2)}</strong></td>
    `;
        cartContainer.appendChild(totalRow);
    }
}

// Add to Cart (Update Cart from product selection)
document.getElementById('add-to-cart').addEventListener('click', () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Add selected items to cart
    products.forEach(product => {
        const checkbox = document.getElementById(`item-${product.id}`);
        if (checkbox.checked) {
            const existingItem = cartItems.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cartItems.push({ ...product, quantity: 1 });
            }
        }
    });

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCart(); // Update the cart display
});

// Update Quantity
function updateQuantity(productId, quantity) {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cartItems.find(item => item.id === productId);
    if (item) {
        item.quantity = parseInt(quantity);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCart();
    }
}

// Remove from Cart
function removeFromCart(productId) {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cartItems.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    updateCart();
}

// Checkout Button
document.getElementById('checkout-btn').addEventListener('click', () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartItems.length > 0) {
        // Display the cart items as JSON
        document.getElementById('json-output').style.display = 'block';
        document.getElementById('json-data').textContent = JSON.stringify(cartItems, null, 2);

        // Clear the cart after displaying the JSON
        localStorage.removeItem('cart');
        updateCart(); // Update the cart display (will be empty now)
    } else {
        alert('Your cart is empty!');
    }
});