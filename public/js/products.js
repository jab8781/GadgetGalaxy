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
            const response = await fetch('http://localhost:5003/api/products', {
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
        const response = await fetch(`http://localhost:5003/api/products/search?${queryParam}`);

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
