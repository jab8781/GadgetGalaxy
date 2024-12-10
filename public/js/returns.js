const thankYouMessage = document.getElementById('thank-you-message');

// Load products from backend and populate product selection list
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:5003/api/products');
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
                <input type="checkbox" id="product-${product.productId}" 
                       data-description="${product.description}" 
                       data-price="${product.price}" 
                       class="product-checkbox">
                ${product.description} - $${product.price.toFixed(2)}
            `;
            productList.appendChild(productItem);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        alert('Could not load products. Please try again later.');
    }
}

// Add selected product to the return
document.getElementById('add-to-return').addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.product-checkbox:checked');
    const returnItems = JSON.parse(localStorage.getItem('returns')) || [];
    const addedItems = [];

    checkboxes.forEach(checkbox => {
        const description = checkbox.dataset.description;
        const price = parseFloat(checkbox.dataset.price);

        const existingItem = returnItems.find(item => item.description === description);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            returnItems.push({ description, price, quantity: 1 });
        }

        addedItems.push(description);
        checkbox.checked = false; // Uncheck the box after adding
    });

    if (addedItems.length > 0) {
        localStorage.setItem('returns', JSON.stringify(returnItems));
        updateReturnTable();
    } else {
        alert('Please select at least one product to add to the return list.');
    }
});

// Update the return table dynamically
function updateReturnTable() {
    const returnItems = JSON.parse(localStorage.getItem('returns')) || [];
    const returnTable = document.getElementById('return-items');
    returnTable.innerHTML = '';
    let total = 0;

    returnItems.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.description}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>
                <button class="btn btn-danger btn-sm" data-index="${index}" onclick="removeReturnItem(${index})">
                    Remove
                </button>
            </td>
        `;
        returnTable.appendChild(row);

        total += item.price * item.quantity;
    });

    // Display the total price
    const totalContainer = document.getElementById('return-items');
    if (returnItems.length > 0) {
        const totalRow = document.createElement('tr');
        totalRow.innerHTML = `
            <td colspan="3" class="text-end"><strong>Total:</strong></td>
            <td><strong>$${total.toFixed(2)}</strong></td>
        `;
        totalContainer.appendChild(totalRow);
    } else {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="4" class="text-end"><strong>Total: $0.00</strong></td>
        `;
        totalContainer.appendChild(emptyRow);
    }
}

// Remove an item from the return list
function removeReturnItem(index) {
    const returnItems = JSON.parse(localStorage.getItem('returns')) || [];
    if (returnItems.length > index) {
        returnItems.splice(index, 1);
        localStorage.setItem('returns', JSON.stringify(returnItems));
        updateReturnTable();
    }
}

// Process return form submission
document.getElementById('process-return-btn').addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const purchaseDate = document.getElementById('purchase-date').value;
    const refundMethod = document.getElementById('refund-method').value;
    const returnItems = JSON.parse(localStorage.getItem('returns')) || [];

    if (!username || !purchaseDate || !refundMethod) {
        alert('Please fill in all the fields.');
        return;
    }

    if (returnItems.length === 0) {
        alert('No items selected for return!');
        return;
    }

    const total = returnItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const returnData = {
        username,
        purchaseDate,
        refundMethod,
        products: returnItems,
        total,
    };

    try {
        // POST request to insert return data
        const response = await fetch('http://localhost:5003/api/returns', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(returnData),
        });

        if (response.ok) {
            thankYouMessage.style.display = 'block';
            document.getElementById('json-output').style.display = 'block';
            document.getElementById('json-data').textContent = JSON.stringify(returnData, null, 2);

            // Clear returns after successful submission
            localStorage.removeItem('returns');
            updateReturnTable();
        } else {
            alert('Error processing return. Please try again.');
        }
    } catch (error) {
        console.error('Error processing return:', error);
        alert('Could not process your return. Please try again later.');
    }
});

// Load products and initialize
window.onload = () => {
    loadProducts();
    updateReturnTable();
};
