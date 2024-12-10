const form = document.getElementById('shipping-form');
const username = document.getElementById('username');
const address = document.getElementById('address');
const city = document.getElementById('city');
const state = document.getElementById('state');
const zipCode = document.getElementById('zip-code');
const shippingCarrier = document.getElementById('shipping-carrier');
const shippingMethod = document.getElementById('shipping-method');
const thankYouMessage = document.getElementById('thank-you-message');
const jsonOutput = document.getElementById('json-output');
const jsonData = document.getElementById('json-data');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (validateInputs()) {
        // Create the JSON object after successful validation
        const formData = {
            username: username.value.trim(),
            address: address.value.trim(),
            city: city.value.trim(),
            state: state.value.trim(),
            zipCode: zipCode.value.trim(),
            shippingCarrier: shippingCarrier.value,
            shippingMethod: shippingMethod.value,
        };

        // POST request to insert shipping data
        try {
            const response = await fetch('http://localhost:5003/api/shipping', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                thankYouMessage.style.display = 'block';
                jsonOutput.style.display = 'block';
                jsonData.textContent = JSON.stringify(formData, null, 2);
                form.reset();
                clearValidation();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to submit shipping data.');
            }
        } catch (error) {
            console.error('Error submitting shipping data:', error);
            alert('An error occurred while submitting your data. Please try again later.');
        }
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
    const usernameValue = username.value.trim();
    const addressValue = address.value.trim();
    const cityValue = city.value.trim();
    const stateValue = state.value.trim();
    const zipCodeValue = zipCode.value.trim();
    const shippingCarrierValue = shippingCarrier.value;
    const shippingMethodValue = shippingMethod.value;
    let isValid = true;

    if (usernameValue === '') {
        setError(username, 'Username is required');
        isValid = false;
    } else {
        setSuccess(username);
    }

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

    return isValid;
};

// Clear validation error/success styles and messages
const clearValidation = () => {
    const inputs = [username, address, city, state, zipCode, shippingCarrier, shippingMethod];
    inputs.forEach(input => {
        const inputControl = input.parentElement;
        const errorDisplay = inputControl.querySelector('.error');
        errorDisplay.innerText = '';  // Clear error messages
        inputControl.classList.remove('error', 'success');  // Remove error/success styles
    });
};
