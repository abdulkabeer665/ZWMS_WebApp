window.onload = function () {
    document.getElementById('loginName').focus();
    checkAPIServerisUP();
};
function checkAPIServerisUP() {
    
    $.ajax({
        url: $('#url_local').val() + "/api/User/APIServerCheck",
        method: "GET",
        success: function (response) {
            // Handle success
            
            //console.log(response);
            ToastHandler(response, 200);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
            //console.log("text status", textStatus)
            //console.log("error Thrown", errorThrown)
            //console.log("jqXHR status", jqXHR.status)
            //EditRes(jqXHR);
            
            ToastHandler("Cannot connect.\nVerify Network.", jqXHR.status);
            //ToastHandler(textStatus, jqXHR.status);
            //Add this after the complete deployment.
            //if (jqXHR.status === 0) {
            //    alert('Cannot connect.\nVerify Network.');
            //} else if (jqXHR.status === 404) {
            //    alert('Requested page not found. [404]');
            //} else if (jqXHR.status === 500) {
            //    alert('Internal Server Error [500].');
            //} else if (textStatus === 'parsererror') {
            //    alert('Requested JSON parse failed.');
            //} else if (textStatus === 'timeout') {
            //    alert('Time out error.');
            //} else if (textStatus === 'abort') {
            //    alert('Ajax request aborted.');
            //} else {
            //    alert('Uncaught Error.\n' + jqXHR.responseText);
            //}
        }
    });
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
    if (response.status == 200) {

        sessionStorage.setItem("yourToken", response["token"]);
        sessionStorage.setItem("loginUserGUID", response["guid"]);
        sessionStorage.setItem("RoleID", response["roleID"]);
        sessionStorage.setItem("loginName", loginName);
        window.location.href = $("#front_URL").val() + "/Home/Index";
        $(".loader").hide();
        $("#mainDIV").removeClass('bg');
    }
    else {
        
        var msg = "Username or Password is wrong";
        var icon = "warning";
        if (response.status == 0) {
            msg = 'Cannot connect. Verify Network.';
            icon = "error"
        }
        swal(msg, {
            icon: icon,
        });
        $(".loader").hide();
        $("#mainDIV").removeClass('bg');
    }
}