$(document).ready(() => {
    $('#signup-btn').click(signUp);
    $('#signin-btn').click(signIn);
    $('#start-btn').click(sendLogin);
});

// variables to make it easy to keep track of where we are
let onSignUpPage = false;

// click event for the sign up button
function signUp() {
    onSignUpPage = true;
    $('#signin-btn').removeClass('disabled');
    $('#signup-btn').addClass('disabled');
    $('#start-btn').html('Get Started!');
    $('#confirm-password').css('display', 'block');
}

// click event for the sign in button
function signIn() {
    onSignUpPage = false;
    $('#signup-btn').removeClass('disabled');
    $('#signin-btn').addClass('disabled');
    $('#start-btn').html('Login');
    $('#confirm-password').css('display', 'none');
}

function sendLogin() {
    let username = $('#username').val();
    let password = $('#password').val();
    let confirmPassword = $('#confirm-password').val();
    let userConfig = {
        'username': username,
        'password': password
    };
    //console.log(`Username: ${username}, Password: ${password}, ConfirmPassword: ${confirmPassword}`);
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
        else {

            // Verify the new username
            var servResponse;
            $.ajax({
                url: '/new_user',
                type: 'POST',
                async: false,
                data: JSON.stringify(userConfig),
                contentType: "application/json; charset=utf-8",

                success: function (result) {
                    console.log(result)
                    servResponse = result;

                },
                error: function (err) {
                    console.log('Error: ${err}')
                }
            })

            if (servResponse.status != "VALID") {
                alert("Username already exists");
                return;
            }

            var header = "Basic " + btoa(userConfig.username + ":" + userConfig.password)
            document.cookie = "Authorization=" + header;

            console.log("Success");

            // Redirect to main page
            $.ajax({
                url: '/play',
                type: 'GET',

                success: function (result) {
                    window.location.replace("/play")
                },
                error: function (err) {
                }
            })
        }
    }
    else {
        // Verify user and redirect to main page
        var servResponse;
        $.ajax({
            url: '/verify_user',
            type: 'POST',
            async: false,
            data: JSON.stringify(userConfig),
            contentType: "application/json; charset=utf-8",

            success: function (result) {
                servResponse = result;
                console.log(servResponse);
            },
            error: function (err) {
                console.log('Error:' + JSON.stringify(err))
            }
        })

        if (servResponse.status != "VALID") {
            alert("Username/Password is invalid.")
            return;
        }

        var header = "Basic " + btoa(userConfig.username + ":" + userConfig.password)
        document.cookie = "Authorization=" + header;

        $.ajax({
            url: '/play',
            type: 'GET',
            beforeSend: function(xhr){
                xhr.setRequestHeader("Authorization", getAuthCookie())
            },

            success: function(result){
                console.log(result);
                window.location.replace("/play");
            },
            error: function(err){
            }
        })
    }
}

function getAuthCookie() {
    var cn = "Authorization=";
    var idx = document.cookie.indexOf(cn)

    if (idx != -1) {
        var end = document.cookie.indexOf(";", idx + 1);
        if (end == -1) end = document.cookie.length;
        return unescape(document.cookie.substring(idx + cn.length, end));
    } else {
        return "";
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
        return "Password cannot contain non-standard characters";
    }
}