const form = document.getElementById('shipping-form');
const address = document.getElementById('address');
const city = document.getElementById('city');
const state = document.getElementById('state');
const zipCode = document.getElementById('zip-code');
const shippingCarrier = document.getElementById('shipping-carrier');
const shippingMethod = document.getElementById('shipping-method');
const thankYouMessage = document.getElementById('thank-you-message');
const jsonOutput = document.getElementById('json-output');
const jsonData = document.getElementById('json-data');

form.addEventListener('submit', e => {
    e.preventDefault();

    if (validateInputs()) {
        // Create the JSON object after successful validation
        const formData = {
            address: address.value.trim(),
            city: city.value.trim(),
            state: state.value.trim(),
            zipCode: zipCode.value.trim(),
            shippingCarrier: shippingCarrier.value,
            shippingMethod: shippingMethod.value
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
    const addressValue = address.value.trim();
    const cityValue = city.value.trim();
    const stateValue = state.value.trim();
    const zipCodeValue = zipCode.value.trim();
    const shippingCarrierValue = shippingCarrier.value;
    const shippingMethodValue = shippingMethod.value;
    let isValid = true;

    if (addressValue === '') {
        setError(address, 'Address is required');
        isValid = false;
    } else {
        setSuccess(address);
    }

    if (cityValue === '') {
        setError(city, 'City is required');
        isValid = false;
    } else {
        setSuccess(city);
    }

    if (stateValue === '') {
        setError(state, 'State is required');
        isValid = false;
    } else {
        setSuccess(state);
    }

    if (zipCodeValue === '') {
        setError(zipCode, 'Zip Code is required');
        isValid = false;
    } else {
        setSuccess(zipCode);
    }

    if (shippingCarrierValue === '') {
        setError(shippingCarrier, 'Shipping carrier is required');
        isValid = false;
    } else {
        setSuccess(shippingCarrier);
    }

    if (shippingMethodValue === '') {
        setError(shippingMethod, 'Shipping method is required');
        isValid = false;
    } else {
        setSuccess(shippingMethod);
    }

    return isValid; // Return whether the form is valid
};

// Function to clear validation error/success styles and messages
const clearValidation = () => {
    const inputs = [address, city, state, zipCode, shippingCarrier, shippingMethod];
    inputs.forEach(input => {
        const inputControl = input.parentElement;
        const errorDisplay = inputControl.querySelector('.error');
        errorDisplay.innerText = '';  // Clear error messages
        inputControl.classList.remove('error', 'success');  // Remove error/success styles
    });
};
