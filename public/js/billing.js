const form = document.getElementById('form');
const username = document.getElementById('username');
const fullName = document.getElementById('full-name');
const address = document.getElementById('address');
const creditCardCompany = document.getElementById('credit-card-company');
const creditCardNumber = document.getElementById('credit-card-number');
const expirationDate = document.getElementById('expiration-date');
const thankYouMessage = document.getElementById('thank-you-message');
const jsonOutput = document.getElementById('json-output');
const jsonData = document.getElementById('json-data');

form.addEventListener('submit', e => {
    e.preventDefault();

    if (validateInputs()) {
        // Create the JSON object after successful validation
        const formData = {
            username: username.value.trim(),
            fullName: fullName.value.trim(),
            address: address.value.trim(),
            creditCardCompany: creditCardCompany.value.trim(),
            creditCardNumber: creditCardNumber.value.trim(),
            expirationDate: expirationDate.value.trim()
        };

        thankYouMessage.style.display = 'block';
        jsonOutput.style.display = 'block';
        jsonData.textContent = JSON.stringify(formData, null, 2);

        sendDataToServer(formData);
        form.reset();
        clearValidation();
    }
});

// POST request to insert billing data
const sendDataToServer = async (data) => {
    try {
        const response = await fetch('http://localhost:5003/api/billing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        console.log(result.message);
    } catch (error) {
        console.error('Error submitting billing data:', error);
    }
};

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
    const fullNameValue = fullName.value.trim();
    const addressValue = address.value.trim();
    const creditCardCompanyValue = creditCardCompany.value.trim();
    const creditCardNumberValue = creditCardNumber.value.trim();
    const expirationDateValue = expirationDate.value.trim();
    let isValid = true;

    if (usernameValue === '') {
        setError(username, 'Username is required');
        isValid = false;
    } else {
        setSuccess(username);
    }

    if (fullNameValue === '') {
        setError(fullName, 'Full Name is required');
        isValid = false;
    } else {
        setSuccess(fullName);
    }

    if (addressValue === '') {
        setError(address, 'Address is required');
        isValid = false;
    } else {
        setSuccess(address);
    }

    if (creditCardCompanyValue === '') {
        setError(creditCardCompany, 'Credit Card Company is required');
        isValid = false;
    } else {
        setSuccess(creditCardCompany);
    }

    if (creditCardNumberValue === '' || !/^\d{16}$/.test(creditCardNumberValue)) {
        setError(creditCardNumber, 'Enter a valid 16-digit credit card number');
        isValid = false;
    } else {
        setSuccess(creditCardNumber);
    }

    if (expirationDateValue === '') {
        setError(expirationDate, 'Expiration date is required');
        isValid = false;
    } else {
        setSuccess(expirationDate);
    }

    return isValid;
};

// Clear validation error/success styles and messages
const clearValidation = () => {
    const inputs = [username, fullName, address, creditCardCompany, creditCardNumber, expirationDate];
    inputs.forEach(input => {
        const inputControl = input.parentElement;
        const errorDisplay = inputControl.querySelector('.error');
        errorDisplay.innerText = '';  // Clear error messages
        inputControl.classList.remove('error', 'success');  // Remove error/success styles
    });
};
