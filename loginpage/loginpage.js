$(document).ready( () => {
    $('#create-account-btn').click(signUp);
    $('#login-btn').click(signIn);
});

// click event for the sign up button
function signUp(){
    $('#login-btn').removeClass('disabled');
    $('#create-account-btn').addClass('disabled');
    $('#start-btn').html('Get Started!');
    $('#confirm-password').css('display', 'block');
}

// click event for the sign in button
function signIn(){
    $('#create-account-btn').removeClass('disabled');
    $('#login-btn').addClass('disabled');
    $('#start-btn').html('Login');
    $('#confirm-password').css('display', 'none');
}