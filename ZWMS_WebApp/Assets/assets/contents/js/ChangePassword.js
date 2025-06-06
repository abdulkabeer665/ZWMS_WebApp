var yourToken;
var loginName;

$(window).on('load', function () {

    $('.loader').show();
    yourToken = localStorage.getItem('yourToken');
    loginName = localStorage.getItem('loginName');
 
    $('.loader').hide();


});
function checkPasswordMatch() {
    var newPassword = document.getElementById('newPassword').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    var passwordMatchMessage = document.getElementById('passwordMatchMessage');

    if (newPassword == "" || confirmPassword == "") {
        passwordMatchMessageSuccess.textContent = '';
        passwordMatchMessageError.textContent = '';
    }
    else if (newPassword === confirmPassword) {
        passwordMatchMessageSuccess.textContent = 'Passwords match';
        passwordMatchMessageError.textContent = '';

    }
    else {
        passwordMatchMessageSuccess.textContent = '';
        passwordMatchMessageError.textContent = 'Passwords do not match';
    }
}

function changePassword() {
    var newPassword = document.getElementById('newPassword').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    var currentPassword = document.getElementById('currentPassword').value;
    if (currentPassword == "" || confirmPassword == "" || newPassword == "") {
        swal({
            title: "All fields are requied!",
            icon: "warning",
            button: "OK",
        })
    }
    else {

        swal({
            title: "Are you sure?",
            text: "You want to submit this record?",
            icon: "warning",
            buttons: [
                'No',
                'Yes'
            ],
            dangerMode: false,
        }).then(function (isConfirm) {
            if (isConfirm) {

                showLoader();
                $.ajax({

                    url: $('#url_local').val() + "/api/User/ChangePassword",
                    type: 'POST',
                    data: JSON.stringify({
                        "loginName": loginName,
                        "oldPassword": currentPassword,
                        "newPassword": newPassword
                    }),
                    contentType: "application/json",
                    headers: { 'Authorization': 'Bearer ' + yourToken },
                    success: function (result) {
                        hideLoader();
                        SaveHandler(result);
                    },
                    error: function (xhr, status, error) {
                        hideLoader();
                        console.log(error);
                        swal({
                            title: 'Request failed:' + error,
                            icon: "error",
                            button: "OK",
                        })
                    }
                });
            }
            else {
            }
        })

    }
}

function SaveHandler(response) {

    var str = response.message;

    if ((response.status != '200')) {
        swal({
            title: response.message + "...",
            icon: "warning",
            button: "OK",
        }).then((exist) => {
            if (exist) {
            }
        })
    }
    else {
        swal({
            title: response.message + "...",
            icon: "success",
            button: "OK",
        }).then((exist) => {
            if (exist) {
               location.reload()
            }
        })
    }
};


function showLoader() {
    document.querySelector('.loader-container').style.display = 'block';

}

function hideLoader() {
    document.querySelector('.loader-container').style.display = 'none';
}

$('#newPassword').on('input', function () {
    var password = $(this).val();

    // Define the regular expressions for password components
    var uppercaseRegex = /[A-Z]/;
    var lowercaseRegex = /[a-z]/;
    var digitRegex = /\d/;
    var specialCharRegex = /[!@#$%^&*()_+]/;

    // Check overall length and each component
    var isLengthValid = password.length >= 8;
    var isUppercaseValid = uppercaseRegex.test(password);
    var isLowercaseValid = lowercaseRegex.test(password);
    var isDigitValid = digitRegex.test(password);
    var isSpecialCharValid = specialCharRegex.test(password);

    // Calculate overall strength (you can customize this logic)
    var strength = 0;
    if (isLengthValid) strength += 20;
    if (isUppercaseValid) strength += 20;
    if (isLowercaseValid) strength += 20;
    if (isDigitValid) strength += 20;
    if (isSpecialCharValid) strength += 20;

    // Update the progress bar
    $('#passwordStrengthProgressBar').css('width', strength + '%').attr('aria-valuenow', strength);

    // Determine the color based on the strength level
    var color = "";
    if (strength === 100) {
        color = "green";
    } else if (strength >= 50) {
        color = "orange";
    } else {
        color = "red";
    }

    // Apply the color to the progress bar
    $('#passwordStrengthProgressBar').css('background-color', color);

    // Construct the final message
    // var message = "Password strength: ";
    if (strength === 100) {
        //message += "Strong";
    } else if (strength >= 50) {
        // message += "Moderate";
    } else {
        // message += "Weak";
    }

    // Display the message next to the password input field
    //$('#passwordStrength').text(message);
});


$('#confirmPassword').on('input', function () {
    var password = $(this).val();

    // Define the regular expressions for password components
    var uppercaseRegex = /[A-Z]/;
    var lowercaseRegex = /[a-z]/;
    var digitRegex = /\d/;
    var specialCharRegex = /[!@#$%^&*()_+]/;

    // Check overall length and each component
    var isLengthValid = password.length >= 8;
    var isUppercaseValid = uppercaseRegex.test(password);
    var isLowercaseValid = lowercaseRegex.test(password);
    var isDigitValid = digitRegex.test(password);
    var isSpecialCharValid = specialCharRegex.test(password);

    // Calculate overall strength (you can customize this logic)
    var strength = 0;
    if (isLengthValid) strength += 20;
    if (isUppercaseValid) strength += 20;
    if (isLowercaseValid) strength += 20;
    if (isDigitValid) strength += 20;
    if (isSpecialCharValid) strength += 20;

    // Update the progress bar
    $('#conpasswordStrengthProgressBar').css('width', strength + '%').attr('aria-valuenow', strength);

    // Determine the color based on the strength level
    var color = "";
    if (strength === 100) {
        color = "green";
    } else if (strength >= 50) {
        color = "orange";
    } else {
        color = "red";
    }

    // Apply the color to the progress bar
    $('#conpasswordStrengthProgressBar').css('background-color', color);

    // Construct the final message
    // var message = "Password strength: ";
    if (strength === 100) {
        //message += "Strong";
    } else if (strength >= 50) {
        // message += "Moderate";
    } else {
        // message += "Weak";
    }

    // Display the message next to the password input field
    //$('#passwordStrength').text(message);
});


$('#infoButton').on('click', function () {
    // Display SweetAlert with password policy


    swal({
        title: "Password Policy",
        text: "Your password should:\n\n" +
            "- Be at least 8 characters long\n" +
            "- Include at least one uppercase letter\n" +
            "- Include at least one lowercase letter\n" +
            "- Include at least one digit\n" +
            "- Include at least one special character",
        icon: "info",
        confirmButtonText: "OK",
    });
});