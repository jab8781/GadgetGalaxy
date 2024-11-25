// Product Data
const products = [
    { id: 1, name: "Apple AirPods", price: 189.99 },
    { id: 2, name: "Apple iPhone", price: 1200.00 },
    { id: 3, name: "Dell Laptop", price: 1600.00 },
    { id: 4, name: "Acer LED Monitor", price: 230.50 },
    { id: 5, name: "ASUS Keyboard", price: 62.00 }
];

// Function to update refund total
function updateRefundTotal() {
    let total = 0;
    // Loop through each product to check if it's selected and calculate total
    products.forEach(product => {
        const checkbox = document.getElementById(`item-${product.id}`);
        if (checkbox.checked) {
            total += parseFloat(checkbox.getAttribute('data-price'));
        }
    });

    // Display total in the Refund Total input
    document.getElementById('refund-total').value = `$${total.toFixed(2)}`;
}

// Event listener to update refund total when any checkbox is changed
products.forEach(product => {
    const checkbox = document.getElementById(`item-${product.id}`);
    checkbox.addEventListener('change', updateRefundTotal);
});

// Handle Submit Return Button
document.getElementById('submit-return').addEventListener('click', () => {
    const selectedItems = [];
    products.forEach(product => {
        const checkbox = document.getElementById(`item-${product.id}`);
        if (checkbox.checked) {
            selectedItems.push(product.name);
        }
    });

    const purchaseDate = document.getElementById('purchase-date').value;
    const refundMethod = document.getElementById('refund-method').value;
    const refundTotal = document.getElementById('refund-total').value;

    // If no products selected or purchase date not filled, show an alert
    if (selectedItems.length === 0 || !purchaseDate) {
        alert("Please select products to return and fill the purchase date.");
        return;
    }

    // Display the form data as a JSON (For demonstration, it could be used for further processing)
    const returnDetails = {
        selectedItems,
        purchaseDate,
        refundMethod,
        refundTotal
    };

    console.log("Return Details:", JSON.stringify(returnDetails, null, 2));

    // Optionally, display the return details on the page
    alert("Return submitted successfully! Check the console for details.");

    // Clear the form after submission
    document.getElementById('product-return-form').reset();
    updateRefundTotal(); // Reset the refund total to 0
});
