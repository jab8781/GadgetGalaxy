const form = document.getElementById('product-form');
const productId = document.getElementById('product-id');
const productDescription = document.getElementById('product-description');
const productCategory = document.getElementById('product-category');
const productPrice = document.getElementById('product-price');
const thankYouMessage = document.getElementById('thank-you-message');
const jsonOutput = document.getElementById('json-output');
const jsonData = document.getElementById('json-data');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (validateInputs()) {
        // Create the JSON object after successful validation
        const formData = {
            productId: productId.value.trim(),
            description: productDescription.value.trim(),
            category: productCategory.value,
            price: parseFloat(productPrice.value).toFixed(2),
        };

        try {
            // PUT request to upsert product data
            const response = await fetch('https://ist256.up.ist.psu.edu:3005/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                thankYouMessage.style.display = 'block';
                jsonOutput.style.display = 'block';
                jsonData.textContent = JSON.stringify(formData, null, 2);
                form.reset();
                clearValidation();
            } else {
                const result = await response.json();
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }
});

// Product search logic
$('#search-form').on('submit', async (e) => {
    e.preventDefault();

    const query = $('#search-query').val().trim();

    if (!query) {
        alert('Please enter a search query.');
        return;
    }

    // Determine the query parameter
    let queryParam = '';
    if (!isNaN(query)) {
        queryParam = `productId=${query}`; // Treat numeric input as productId
    } else if (query.includes(' ')) {
        queryParam = `description=${encodeURIComponent(query)}`; // Treat multi-word input as description
    } else {
        queryParam = `category=${encodeURIComponent(query)}`; // Treat single word input as category
    }

    try {
        const response = await fetch(`https://ist256.up.ist.psu.edu:3005/api/products/search?${queryParam}`);

        if (response.ok) {
            const result = await response.json();
            $('#search-results').show();
            $('#search-results-data').text(JSON.stringify(result, null, 2));
        } else if (response.status === 404) {
            $('#search-results').show();
            $('#search-results-data').text('No products found.');
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error searching for products:', error);
    }
});

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

// Load products on page load
window.addEventListener('DOMContentLoaded', loadProducts);

// Add event listener for delete button
const deleteButton = document.getElementById('delete-selected');
deleteButton.addEventListener('click', async () => {
    const selectedCheckboxes = document.querySelectorAll('.product-checkbox:checked');
    
    // Collect product IDs and convert them to strings
    const productIdsToDelete = Array.from(selectedCheckboxes).map(checkbox => String(checkbox.id.split('-')[1]));
  
    console.log('Product IDs to delete:', productIdsToDelete);
  
    if (productIdsToDelete.length === 0) {
      alert('No products selected for deletion.');
      return;
    }
  
    try {
      const response = await fetch('https://ist256.up.ist.psu.edu:3005/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: productIdsToDelete }),
      });
  
      const result = await response.json();
      console.log('Delete response:', result);
  
      if (response.ok) {
        // alert('Selected products deleted successfully.');
        loadProducts(); // Reload the product list
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting products:', error);
      alert('Could not delete products. Please try again later.');
    }
  });
  
  // Populate product dropdown for quantity update
async function populateProductDropdown() {
    try {
      const response = await fetch('https://ist256.up.ist.psu.edu:3005/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products from the server.');
      }
  
      const products = await response.json();
      const productSelect = document.getElementById('update-product-select');
  
      productSelect.innerHTML = '<option value="">Select a product</option>'; // Clear existing options
      products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.productId;
        option.textContent = `${product.description} - $${product.price.toFixed(2)}`;
        productSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error populating product dropdown:', error);
      alert('Could not load products. Please try again later.');
    }
  }
  
  // Handle quantity update form submission
  document.getElementById('update-quantity-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const productId = document.getElementById('update-product-select').value;
    const quantity = parseInt(document.getElementById('update-quantity').value, 10);
  
    if (!productId || isNaN(quantity) || quantity < 0) {
      alert('Please select a valid product and enter a valid quantity.');
      return;
    }
  
    try {
      const response = await fetch('https://ist256.up.ist.psu.edu:3005/api/products/quantity', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert('Quantity updated successfully.');
        populateProductDropdown(); // Refresh the product dropdown
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Could not update quantity. Please try again later.');
    }
  });
  
  // Call populateProductDropdown on page load
  populateProductDropdown();
  

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
};

const setSuccess = (element) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const validateInputs = () => {
    const productIdValue = productId.value.trim();
    const productDescriptionValue = productDescription.value.trim();
    const productCategoryValue = productCategory.value;
    const productPriceValue = productPrice.value.trim();
    let isValid = true; // Track if the form is valid

    if (productIdValue === '') {
        setError(productId, 'Product ID is required');
        isValid = false;
    } else {
        setSuccess(productId);
    }

    if (productDescriptionValue === '') {
        setError(productDescription, 'Product description is required');
        isValid = false;
    } else {
        setSuccess(productDescription);
    }

    if (productCategoryValue === '') {
        setError(productCategory, 'Product category is required');
        isValid = false;
    } else {
        setSuccess(productCategory);
    }

    if (productPriceValue === '') {
        setError(productPrice, 'Product price is required');
        isValid = false;
    } else if (isNaN(productPriceValue) || parseFloat(productPriceValue) <= 0) {
        setError(productPrice, 'Provide a valid price greater than 0');
        isValid = false;
    } else {
        setSuccess(productPrice);
    }

    return isValid;
};

// Clear validation error/success styles and messages
const clearValidation = () => {
    const inputs = [productId, productDescription, productCategory, productPrice];
    inputs.forEach((input) => {
        const inputControl = input.parentElement;
        const errorDisplay = inputControl.querySelector('.error');
        errorDisplay.innerText = ''; // Clear error messages
        inputControl.classList.remove('error', 'success'); // Remove error/success styles
    });
};
