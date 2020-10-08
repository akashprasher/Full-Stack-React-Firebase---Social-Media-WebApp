// Checking email Format
const isEmail = (email) => {
    const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(regEx)) return true;
    else return false;
}

// Checking the content
const isEmpty = (string) => {
    if (string.trim() === '') return true;
    else return false;
}

exports.validateSignupData = (data) => {
    let errors = {};

    if (isEmpty(data.email)) {
        errors.email = 'Email must not be Empty'
    } else if (!isEmail(data.email)) {
        errors.email = "Must be a valid Email";
    }

    if (isEmpty(data.password)) errors.password = 'Must not be empty';

    if (data.password !== data.confirmPassword) errors.password = 'Password not matched';

    if (isEmpty(data.handle)) errors.handle = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.validateLoginData = (data) => {
    let errors = {};

    if(isEmpty(data.email)) errors = 'Must not be empty';
    if(isEmpty(data.password)) errors = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

// User details like Bio/Location/Website
exports.reduceUserDetails = (data) => {
    let userDetails = {};
    if(!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
    if(!isEmpty(data.website.trim())) {
        // https://website.com
        if(data.website.trim().substring(0, 4) !== 'http'){
            userDetails.website = `http://${data.website.trim()}`;
        } else userDetails.website = data.website;
    }
    if(!isEmpty(data.location.trim())) userDetails.loaction = data.location;
    return userDetails;
}