module.exports = {
    validateStringLength(value, min, max) {
        return value.length > min && value.length < max;
    },
    validateStringLengthIsAtLeast(value, minLength) {
        return value.length >= minLength;
    },
    validatePasswordContainsDigitsAndLetters(password) {
        let regex = /^[a-zA-Z-0-9]+$/;

        return regex.test(password);
    },
    validateEmail(email) {
        let regex = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return regex.test(email);
    }
};