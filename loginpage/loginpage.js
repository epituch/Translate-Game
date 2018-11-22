$(document).ready(() => {
    $('#create-account-btn').click(signUp);
    $('#login-btn').click(signIn);
    $('#start-btn').click(sendLogin);
});

// variables to make it easy to keep track of where we are
let onSignUpPage = true;

// click event for the sign up button
function signUp() {
    onSignUpPage = true;
    $('#login-btn').removeClass('disabled');
    $('#create-account-btn').addClass('disabled');
    $('#start-btn').html('Get Started!');
    $('#confirm-password').css('display', 'block');
}

// click event for the sign in button
function signIn() {
    onSignUpPage = false;
    $('#create-account-btn').removeClass('disabled');
    $('#login-btn').addClass('disabled');
    $('#start-btn').html('Login');
    $('#confirm-password').css('display', 'none');
}

function sendLogin() {
    let username = $('#username').val();
    let password = $('#password').val();
    let confirmPassword = $('#confirm-password').val();
    console.log(`Username: ${username}, Password: ${password}, ConfirmPassword: ${confirmPassword}`);
    if (onSignUpPage) {
        // check if username is valid 
        let err;
        if ((err = checkUserName(username)) != 'valid') {
            console.log('Username invalid');
            alert(err);
            return;
        }
        else if ((err = checkPassword(password)) != 'valid') {
            console.log('Passowrd invalid');
            alert(err);
            return;
        }
        else if (password != confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        else{
            console.log("Success");
            window.location.replace("..");
        }
    }
    else {
        // check database for user

    }
}

/*
* returns Valid if the username is valid and 
* returns a string saying whats wrong if its not
*/
function checkUserName(username) {
    if (username.length < 6) {
        return "Username too short, must be in between 6 and 31 characters";
    }
    else if (username.length > 31) {
        return "Username too long, must be in between 6 and 31 characters";
    }
    let regex = '[a-zA-Z0-9_]';
    let found = username.match(regex);
    if (found) {
        return "valid";
    }
    else {
        return "Username can only contain alphanumeric characters and _";
    }
}

/*
* returns Valid if the password is valid and 
* returns a string saying whats wrong if its not
*/
function checkPassword(password) {
    if (password.length < 7) {
        return "Password too short, must be in between 6 and 31 characters";
    }
    else if (password.length > 31) {
        return "Password too long, must be in between 6 and 31 characters";
    }
    let regex = "[ -~]";
    let found = password.match(regex);
    if (found) {
        return "valid";
    }
    else {
        return "Password cannot contain non-standard ascii characters";
    }
}