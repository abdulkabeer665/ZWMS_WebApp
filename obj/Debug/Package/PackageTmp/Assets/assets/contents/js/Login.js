window.onload = function () {
    document.getElementById('loginName').focus();
};
$(document).ready(function () {
    sessionStorage.clear();
});
$("#btnLogin").click(function () {
    $("#mainDIV").addClass('bg');
    $(".loader").show();
    var loginName = $("#loginName").val();
    var pass = $("#password").val();
    if (loginName == "") {
        swal("Please enter a username", {
            icon: "warning",
        });
        $("#mainDIV").removeClass('bg');
    } else
    if (pass == "") {
        swal("Please enter a password", {
            icon: "warning",
        });
        $("#mainDIV").removeClass('bg');
    }
    else {
        Common.Ajax('POST', $('#url_local').val() + "/api/User/LoginWeb", "{ \"loginName\": \"" + loginName + "\",\"password\": \"" + pass + "\"}", 'json', EditRes);
    }
});
function EditRes(response) {
    var loginName = $("#loginName").val();
    if (response.status == '200') {
        sessionStorage.setItem("yourToken", response["token"]);
        sessionStorage.setItem("loginUserGUID", response["guid"]);
        sessionStorage.setItem("loginName", loginName);
        window.location.href = $("#front_URL").val() + "/Home/Index";
        $(".loader").hide();
        $("#mainDIV").removeClass('bg');
    }
    else {
        swal("Username or Password is wrong", {
            icon: "warning",
        });
    }
}