const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const thankYouMessage = document.getElementById('thank-you-message');
const jsonOutput = document.getElementById('json-output');
const jsonData = document.getElementById('json-data');

form.addEventListener('submit', e => {
    e.preventDefault();

    if (validateInputs()) {
        // Create the JSON object after successful validation
        const formData = {
            username: username.value.trim(),
            email: email.value.trim(),
            password: password.value.trim(),
            confirmPassword: password2.value.trim()
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

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const validateInputs = () => {
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();
    let isValid = true;  // Track if the form is valid

    if(usernameValue === '') {
        setError(username, 'Username is required');
        isValid = false;
    } else {
        setSuccess(username);
    }

    if(emailValue === '') {
        setError(email, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');
        isValid = false;
    } else {
        setSuccess(email);
    }

    if(passwordValue === '') {
        setError(password, 'Password is required');
        isValid = false;
    } else if (passwordValue.length < 8) {
        setError(password, 'Password must be at least 8 characters long');
        isValid = false;
    } else {
        setSuccess(password);
    }

    if(password2Value === '') {
        setError(password2, 'Please confirm your password');
        isValid = false;
    } else if (password2Value !== passwordValue) {
        setError(password2, "Passwords don't match");
        isValid = false;
    } else {
        setSuccess(password2);
    }

    return isValid;  // Return whether the form is valid
};

// Function to clear validation error/success styles and messages
const clearValidation = () => {
    const inputs = [username, email, password, password2];
    inputs.forEach(input => {
        const inputControl = input.parentElement;
        const errorDisplay = inputControl.querySelector('.error');
        errorDisplay.innerText = '';  // Clear error messages
        inputControl.classList.remove('error', 'success');  // Remove error/success styles
    });
};
