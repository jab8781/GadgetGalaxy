const form = document.getElementById('product-form');
const productId = document.getElementById('product-id');
const productDescription = document.getElementById('product-description');
const productCategory = document.getElementById('product-category');
const productPrice = document.getElementById('product-price');
const thankYouMessage = document.getElementById('thank-you-message');
const jsonOutput = document.getElementById('json-output');
const jsonData = document.getElementById('json-data');

form.addEventListener('submit', e => {
    e.preventDefault();

    if (validateInputs()) {
        // Create the JSON object after successful validation
        const formData = {
            productId: productId.value.trim(),
            productDescription: productDescription.value.trim(),
            productCategory: productCategory.value,
            productPrice: parseFloat(productPrice.value).toFixed(2)
        };

        // Display thank you message
        thankYouMessage.style.display = 'block';

        // Display the JSON object below the form
        jsonOutput.style.display = 'block';
        jsonData.textContent = JSON.stringify(formData, null, 2); // Pretty-print JSON

        // Clear the form and reset any error/success messages
        form.reset();  // Reset the form fields
        clearValidation(); // Clear all validation messages and styles
    }
});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
}

const setSuccess = element => {
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
    let isValid = true;  // Track if the form is valid

    if (productIdValue === '') {
        setError(productId, 'Product ID is required');
        isValid = false;
    } else if (!/^\d{8}$/.test(productIdValue)) {
        setError(productId, 'Product ID must be exactly 8 digits');
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

    return isValid;  // Return whether the form is valid
};

// Function to clear validation error/success styles and messages
const clearValidation = () => {
    const inputs = [productId, productDescription, productCategory, productPrice];
    inputs.forEach(input => {
        const inputControl = input.parentElement;
        const errorDisplay = inputControl.querySelector('.error');
        errorDisplay.innerText = '';  // Clear error messages
        inputControl.classList.remove('error', 'success');  // Remove error/success styles
    });
};
