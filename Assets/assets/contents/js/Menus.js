var yourToken;
var loginName;
var roleGUID;
$(window).on('load', function () {

    yourToken = localStorage.getItem('yourToken');
    loginName = localStorage.getItem('loginName');
    roleGUID = localStorage.getItem('RoleID');
    
    if (loginName == "" || loginName == null) {
        
        window.location.href = $("#front_URL").val() + "/Login/Index";
    }
    else {
        getAllMenus(roleGUID);
    }

});

function getAllMenus(roleGUID) {

    $.ajax({
        url: $('#url_local').val() + "/api/Menu/GetAllMenus",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({
            "roleID": roleGUID
        }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (result) {
            MenuHandler(result);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }
    });
    
};

function MenuHandler(response) {
    
    for (i = 0; i < response.parentMenu.length; i++) {
        var menuHTML = '';
        if (response.parentMenu[i]["parentMenuName"] == "DASHBOARD" && i == 0) {
            menuHTML += '<div class="nav-group show">'
        }
        else {
            menuHTML += '<div class="nav-group">'
        }
        menuHTML += '<a href="#" class="nav-label">' + response.parentMenu[i]["parentMenuName"] + '</a>';   //Parent Menu Name
        menuHTML += '<ul class="nav nav-sidebar">';
        for (var j = 0; j < response.childMenu.length; j++) {

            if (response.parentMenu[i]["parentMenuID"] == response.childMenu[j]["parentMenuID"]) {   
                menuHTML += '<li class="nav-item" id="' + response.childMenu[j]["menuID"] + '" onclick="storeMenuID(\'' + response.childMenu[j]["menuID"] + '\')">';
                menuHTML += '<a href="' + response.childMenu[j]["linkPage"] + '" class="nav-link"><i class="' + response.childMenu[j]["icon"] + '"></i><span>' + response.childMenu[j]["menuName"] + '</span></a>';   //Child Menu Name
                menuHTML += '</li>';
            }
        }
        menuHTML += '</ul>';
        menuHTML += '</div>';
        $('#sidebarMenu').append(menuHTML);
    }

    $.getScript('/Assets/assets/js/script.js')
    .done(function (script, textStatus) {
        //console.log('Script loaded successfully.');
    })
    .fail(function (jqxhr, settings, exception) {
        console.log('Script loading failed: ', exception);
    });
};

function storeMenuID(value) {
    localStorage.setItem('menuID', value);
};

$("#logOutBtn").click(function () {
    
    // Log out and clear localStorage
    localStorage.clear();

    window.history.forward();

    window.onunload = function () { null };

})