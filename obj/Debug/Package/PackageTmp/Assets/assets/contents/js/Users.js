var yourToken;
var loginName;

$(window).on('load', function () {
    yourToken = sessionStorage.getItem('yourToken');
    loginName = sessionStorage.getItem('loginName');
    loginUserGUID = sessionStorage.getItem('loginUserGUID');
    $('.loader').show();
    loadGridAjax();
    loadRoles();

});

function loadRoles() {
    $.ajax({
        url: $('#url_local').val() + "/api/Roles/GetAllRoles",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({ "GET": 1 }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            // Handle the successful response
            ddlHandler(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }
    });
};

function ddlHandler(response) {
    fillddls('role', 'Please Select Role', response)
};

function fillddls(name, selecttext, data) {
    $("#" + name).empty();
    var s = '<option value="0">' + selecttext + '</option>';
    $.each(data, function (index, item) {
        s += '<option value="' + item.guid + '">' + item.engName + '</option>';
    });
    $("#" + name).html(s);
};

$('#btnadd').click(function () {
    var checkbox = document.getElementById('active');
    checkbox.checked = true;

    var element = document.getElementById('hideDiv1');
    element.style.display = 'block';
    var element1 = document.getElementById('hideDiv2');
    element1.style.display = 'block';

    $('#code').val('');
    $('#engName').val('');
    $('#name').val('');
    $('#role').val(0);
    $('#loginID').val('');
    $('#password').val('');
    $('#confirmPassword').val('');
    $('#notes').val('');
    $('#btnsave').text($('#hdnsave').val());
    $('#btnsave').prop('title', 'Save');
    $('#modal-lg').modal('show');
});

function loadGridAjax() {
    $.ajax({
        url: $('#url_local').val() + "/api/User/GetAllUsers",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({ "GET": 1 }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            // Handle the successful response
            FillGridHandler(data);
            $('.loader').hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }
    });
};

function FillGridHandler(response) {

    var btnedit_ = 1;
    var btndel_ = 1;
    var hasrigth = 1;
    var btnadd_ = "btnadd";

    Bindbody(response, 'tblUsers', btnedit_, btndel_);
    if (btnadd_ == "btnadd" && hasrigth == 1) {
        $('#' + btnadd_).prop('disabled', false);
        //$('#' + btnadd_).css('display', 'block');
    }
};

function Bindbody(json, tablename, edit_rights, delete_rights) {
    
    var tr;
    var Edit_R;
    var Delete_R;
    $("#" + tablename).DataTable().destroy();
    $("#" + tablename + ' tbody').empty();
    //debugger
    for (var i = 0; i < json.length; i++) {
        if (edit_rights == 1) {
            Edit_R = "<i class=\"fa fa-edit\" style='cursor: pointer;' title=\"Edit\" onclick=Edit('" + i + "')></i> ";
            //Edit_R = "<i class=\"fa fa-edit\" style='cursor: pointer;' title=\"Edit\" onclick=Edit('" + json[i].guid + "')></i> ";
        }
        if (delete_rights == 1) {
            Delete_R = "<i  class=\"fa fa-trash\" style='cursor: pointer;' title=\"Delete\" onclick=Delete('" + json[i].guid + "')></i>";
        }
        /*debugger*/
        tr = $('<tr/>');
        tr.append("<td  style='display: none;'>" + json[i].guid + "</td>");
        tr.append("<td>" + json[i].code + "</td>");
        tr.append("<td>" + json[i].engName + "</td>");
        tr.append("<td>" + json[i].name + "</td>");
        tr.append("<td>" + json[i].loginName + "</td>");
        tr.append("<td  style='display: none;'>" + json[i].roleGUID + "</td>");
        tr.append("<td>" + json[i].roleName + "</td>");
        //tr.append("<td  style='display: none;'>" + json[i].password + "</td>");
        tr.append("<td  style='display: none;'>" + json[i].status + "</td>");
        tr.append("<td  style='display: none;'>" + json[i].notes + "</td>");
        tr.append("<td>" + json[i].statusName + "</td>");

        if (Edit_R == undefined && Delete_R != undefined) {
            tr.append("<td style='padding-top: 5px !important'><button class='btn btn-danger'> " + Delete_R + "</button></td>");
        }
        else if (Delete_R == undefined && Edit_R != undefined) {
            tr.append("<td style='padding-top: 5px !important'> <button class='btn btn-primary'>  " + Edit_R + "</button></td>");
        }
        else if (Delete_R == undefined && Edit_R == undefined) {
            tr.append("<td></td>");
        }
        else {
            tr.append("<td style='padding-top: 5px !important'> <button class='btn btn-primary'>  " + Edit_R + "</button> <button class='btn btn-danger'> " + Delete_R + "</button></td>");
        }
        //tr.append("<td style='padding-top: 5px !important'> <button class='btn btn-primary'>  <i  class=\"fa fa-edit \"  title=\"Edit\"  onclick=Edit('" + i + "')></i></button> <button class='btn btn-danger'> <i  class=\"fa fa-trash\"  title=\"Delete\"   onclick=Delete('" + json[i].guid + "')></i> </button></td>");

        $("#" + tablename + ' tbody').append(tr);
    }
    $("#" + tablename).DataTable(
    {
        "dom": '<"row justify-content-between top-information"lf>rt<"row justify-content-between bottom-information"ip><"clear">'
    });
};

$('#cls').click(function () {
    $('#modal-lg').modal('hide');
});

$('#btnclose').click(function () {
    $('#modal-lg').modal('hide');
});

$('#btnsave').click(function () {

    var status = 0;

    var checkbox = document.getElementById('active');
    if (checkbox.checked) {
        status = 1;
    }
    else if ($('#loginID').val() == '') {
        alert("Login Name must be enter.")
        return;
    }
    if ($('#engName').val() == '') {
        alert("Eng Name must be enter.")
        return;
    } else
    if ($('#role').val() == 0) {
        alert("Role must be selected.")
        return;
    }
    else {
debugger
        var flag = $('#btnsave').attr('title');
        if (flag == "Update") {
            $.ajax({
                url: $('#url_local').val() + "/api/User/UpdateUser",
                type: 'POST',
                contentType: 'application/json', // Set the content type based on your API requirements
                data: JSON.stringify({
                    "update": 1,
                    "guid": $("#userGUID").val(),
                    "code": $("#code").val(),
                    "engName": $("#engName").val(),
                    "name": $("#name").val(),
                    //"loginName": $("#loginName").val(),
                    "password": $("#password").val(),
                    "status": status,
                    "roleGUID": $("#role").val(),
                    "notes": $("#notes").val(),
                    "lastEditBy": loginUserGUID

                }), // Adjust the payload format based on your API
                headers: {
                    'Authorization': 'Bearer ' + yourToken
                },
                success: function (data) {
                    SaveHandler(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // Handle the error
                    console.log('AJAX Error: ' + textStatus, errorThrown);
                    console.log(jqXHR.responseText); // Log the response for more details
                }
            });
        }
        else {
            $.ajax({
                url: $('#url_local').val() + "/api/User/InsertUser",
                type: 'POST',
                contentType: 'application/json', // Set the content type based on your API requirements
                data: JSON.stringify({
                    "add": 1,
                    "code": $("#code").val(),
                    "engName": $("#engName").val(),
                    "name": $("#name").val(),
                    "loginName": $("#loginID").val(),
                    "password": $("#password").val(),
                    "status": status,
                    "roleGUID": $("#role").val(),
                    "notes": $("#notes").val(),
                    "createdBy": loginUserGUID

                }), // Adjust the payload format based on your API
                headers: {
                    'Authorization': 'Bearer ' + yourToken
                },
                success: function (data) {
                    SaveHandler(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // Handle the error
                    console.log('AJAX Error: ' + textStatus, errorThrown);
                    console.log(jqXHR.responseText); // Log the response for more details
                }
            });
        }
    }
});

function Edit(value) {
    debugger
    var element = document.getElementById('hideDiv1');
    element.style.display = 'none';
    var element1 = document.getElementById('hideDiv2');
    element1.style.display = 'none';
    var checkbox = document.getElementById('active');
    var table = $('#tblUsers').DataTable();
    var data = table.row(value).data();
    $('#userGUID').val(data[0]);
    $('#code').val(data[1]);
    $('#engName').val(data[2]);
    $('#name').val(data[3]);
    $('#loginID').val(data[4]);
    $('#role').val(data[5]);
    if (data[7] == "true") {
        checkbox.checked = true;
    }
    else {
        checkbox.checked = false;
    }
    $('#notes').val(data[8]);
    $('#password').val('');
    $('#confirmPassword').val('');
    $('#modal-lg').modal('show');
    $('#btnsave').prop('title', 'Update');
    $('#btnsave').text($('#hdnupdate').val());
};

function Delete(value) {
    
    swal({
        title: "Are you sure?",
        text: "You won't retrieve this record again!",
        icon: "warning",
        buttons: [
            'No, cancel it!',
            'Yes, I am sure!'
        ],
        dangerMode: true,
    }).then(function (isConfirm) {
        if (isConfirm) {
            $.ajax({
                url: $('#url_local').val() + "/api/User/DeleteUser",
                type: 'POST',
                contentType: 'application/json', // Set the content type based on your API requirements
                data: JSON.stringify({
                    "update": 1,
                    "delete": 1,
                    "guid": value

                }), // Adjust the payload format based on your API
                headers: {
                    'Authorization': 'Bearer ' + yourToken
                },
                success: function (data) {
                    // Handle the successful response

                    SaveHandler(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // Handle the error
                    console.log('AJAX Error: ' + textStatus, errorThrown);
                    console.log(jqXHR.responseText); // Log the response for more details
                }
            });
        } else {
            swal("Cancelled", "Your record is safe!", "error");
        }
    })
};

function saveHandlerInvalidKey(response) {

    swal({
        title: response.message + "...",
        icon: "warning",
        button: "OK",
    }).then((Save) => {
        if (Save) {
            loadGridAjax()
        }
    })
};

function SaveHandler(response) {
    $('#modal-lg').modal('hide');

    var str = response.message;
    if (str.includes("Already")) {
        swal({
            title: response.message + "...",
            icon: "warning",
            button: "OK",
        }).then((exist) => {
            if (exist) {
                location.href = '';
            }
        })
    }
    else {
        swal({
            title: response.message + "...",
            icon: "success",
            button: "OK",
        }).then((Save) => {
            if (Save) {
                loadGridAjax()
            }
        })

    }
};

// Get the password and confirm password input fields
var passwordInput = document.getElementById('password');
var confirmPasswordInput = document.getElementById('confirmPassword');
var passwordError = document.getElementById('passwordError');

// Function to validate password confirmation
function validatePasswordConfirmation() {
    var password = passwordInput.value;
    var confirmPassword = confirmPasswordInput.value;

    // Reset previous error message and style
    passwordError.textContent = '';
    passwordError.style.color = ''; // Reset color
    // Check if passwords match
    if (password !== confirmPassword) {
        passwordError.textContent = 'Passwords do not match';
        passwordError.style.color = 'red'; // Change color to green
    } else {
        // Check if password meets length requirement
        if (password.length < 8) {
            passwordError.textContent = 'Password must be at least 8 characters long';
            passwordError.style.color = 'red'; // Change color to green
        } else {
            passwordError.textContent = 'Password matched';
            passwordError.style.color = 'green'; // Change color to green
        }
    }
}

// Add event listener for input event on confirmPasswordInput
confirmPasswordInput.addEventListener('input', validatePasswordConfirmation);

document.getElementById('passwordToggle').addEventListener('click', function () {
    var passwordInput = document.getElementById('password');
    var icon = this.querySelector('i');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('ri-eye-close-line');
        icon.classList.add('ri-eye-line');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('ri-eye-line');
        icon.classList.add('ri-eye-close-line');
    }
});

document.getElementById('confirmPasswordToggle').addEventListener('click', function () {
    var confirmPasswordInput = document.getElementById('confirmPassword');
    var icon = this.querySelector('i');
    if (confirmPasswordInput.type === 'password') {
        confirmPasswordInput.type = 'text';
        icon.classList.remove('ri-eye-close-line');
        icon.classList.add('ri-eye-line');
    } else {
        confirmPasswordInput.type = 'password';
        icon.classList.remove('ri-eye-line');
        icon.classList.add('ri-eye-close-line');
    }
});