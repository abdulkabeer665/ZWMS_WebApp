window.onload = function () {
    document.getElementById('loginName').focus();
};
$(document).ready(function () {
    sessionStorage.clear();

  //  Common.Ajax('POST', $('#url_local').val() + "/api/Authentication/CreateAdmin", "{}", 'json');

});

$("#btnLogin").click(function () {
    // alert("alert")
    var loginName = $("#loginName").val();
    var pass = $("#password").val();
    if (loginName == "") {
        swal("Please enter a username", {
            icon: "warning",
        });
    }
    else if (pass == "") {
        swal("Please enter a password", {
            icon: "warning",
        });
    }
    //else if (loginID == 'admin' && pass == 'pass') {
    //    console.log("Correct password!")
    //}
    else {
        //alert("in else")
        Common.Ajax('POST', $('#url_local').val() + "/api/User/Login", "{ \"loginName\": \"" + loginName + "\",\"password\": \"" + pass + "\"}", 'json', EditRes);
    }
})

function EditRes(response) {
    console.log(response["token"])
    var loginName = $("#loginName").val();
 
    //console.log(response.message)
    if (response.status == '200') {
       
        sessionStorage.setItem("yourToken", response["token"]);
        sessionStorage.setItem("loginName", loginName);
        window.location.href = $("#front_URL").val() + "/Home/Index";

    }
    else {
        swal("Username or Password is wrong", {
            icon: "warning",
        });
        /*alert(response.message)*/
    }
}