const thankYouMessage = document.getElementById('thank-you-message');

// Load products from backend and populate product selection list
async function loadProducts() {
    try {
        const response = await fetch('https://ist256.up.ist.psu.edu:3005/api/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products from the server.');
        }

        const products = await response.json();

        // Populate product selection list
        const productList = document.getElementById('product-list');
        productList.innerHTML = ''; // Clear any existing content

        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('list-group-item');
            productItem.innerHTML = `
                <input type="checkbox" id="product-${product.productId}" data-description="${product.description}" data-price="${product.price}">
                ${product.description} - $${product.price.toFixed(2)}
            `;
            productList.appendChild(productItem);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        alert('Could not load products. Please try again later.');
    }
}

// Update the cart table dynamically
function updateCart() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');

    cartContainer.innerHTML = ''; // Clear existing cart items
    let total = 0;

    cartItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.description}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <input type="number" class="form-control w-25" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
            </td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Remove</button>
            </td>
        `;
        cartContainer.appendChild(row);
        total += item.price * item.quantity;
    });

    // Display the total price
    if (cartItems.length > 0) {
        const totalRow = document.createElement('tr');
        totalRow.innerHTML = `
            <td colspan="3" class="text-end"><strong>Total:</strong></td>
            <td><strong>$${total.toFixed(2)}</strong></td>
        `;
        cartContainer.appendChild(totalRow);
    } else {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="4" class="text-end"><strong>Total: $0.00</strong></td>
        `;
        cartContainer.appendChild(emptyRow);
    }
}

// Add selected products to the cart
document.getElementById('add-to-cart').addEventListener('click', () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const checkboxes = document.querySelectorAll('#product-list input[type="checkbox"]:checked');

    checkboxes.forEach(checkbox => {
        const productId = parseInt(checkbox.id.split('-')[1]);
        const description = checkbox.dataset.description;
        const price = parseFloat(checkbox.dataset.price);

        const existingItem = cartItems.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({ id: productId, description, price, quantity: 1 });
        }
    });

    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCart(); // Refresh the cart display
});

// Update the quantity of an item in the cart
function updateQuantity(productId, quantity) {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cartItems.find(item => item.id === productId);

    if (item) {
        item.quantity = parseInt(quantity, 10);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCart(); // Refresh the cart display
    }
}

// Remove an item from the cart
function removeFromCart(productId) {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cartItems.filter(item => item.id !== productId);

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    updateCart(); // Refresh the cart display
}

// Process purchase/checkout form submission
document.getElementById('checkout-btn').addEventListener('click', async () => {
    const username = document.getElementById('username').value; // Get the username from the page

    if (!username) {
        alert('Username is required for checkout.');
        return;
    }

    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    if (cartItems.length > 0) {
        const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        const purchaseData = {
            username,
            products: cartItems.map(item => ({
                description: item.description,
                quantity: item.quantity,
                price: item.price
            })),
            total: cartTotal
        };

        try {
            // POST request to insert purchase/checkout data
            const response = await fetch('https://ist256.up.ist.psu.edu:3005/api/purchases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(purchaseData)
            });

            if (response.ok) {
                thankYouMessage.style.display = 'block';
                document.getElementById('json-output').style.display = 'block';
                document.getElementById('json-data').textContent = JSON.stringify(purchaseData, null, 2);

                // Clear the cart after successful submission
                localStorage.removeItem('cart');
                updateCart();
                //alert('Purchase successful!');
            } else {
                alert('Error submitting purchase data. Please try again.');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('Could not process your purchase. Please try again later.');
        }
    } else {
        alert('Your cart is empty!');
    }
});

// Load products and initialize
window.onload = () => {
    loadProducts();
    updateCart();
};
