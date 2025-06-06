function getMenuOptionsForThree(roleGUID, menuGUID, yourToken, callback) {

    $.ajax({
        url: $('#url_local').val() + "/api/Menu/GetMenuOptions",
        type: 'POST', // or 'POST' as needed
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({
            "roleID": roleGUID,
            "menuID": menuGUID,
        }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            var addRight = data[0]["value"];
            var editRight = data[1]["value"];
            var deleteRight = data[2]["value"];

            // Call the callback function with required parameters
            if (callback) {
                callback(addRight, editRight, deleteRight);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error fetching menu options:', errorThrown);
        }
    });
};

function getMenuOptions(roleGUID, menuGUID, yourToken, callback) {
    
    $.ajax({
        url: $('#url_local').val() + "/api/Menu/GetMenuOptions",
        type: 'POST', // or 'POST' as needed
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({
            "roleID": roleGUID,
            "menuID": menuGUID,
        }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            
            let rights = {}; // Object to store rights dynamically

            // Loop through data to dynamically assign rights
            data.forEach((item, index) => {
                let key = item["optionName"]; // Assuming optionName is available in the response
                rights[key] = item["value"];
            });

            // Pass the dynamic rights object to the callback
            if (callback) {
                callback(rights);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error fetching menu options:', errorThrown);
        }
    });
};

function getMenuOptionsForFive(roleGUID, menuGUID, yourToken, callback) {
    
    $.ajax({
        url: $('#url_local').val() + "/api/Menu/GetMenuOptions",
        type: 'POST', // or 'POST' as needed
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({
            "roleID": roleGUID,
            "menuID": menuGUID,
        }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            var addRight = data[0]["value"];
            var editRight = data[1]["value"];
            var deleteRight = data[2]["value"];
            var viewRight = data[3]["value"];
            var additional = data[4]["value"];

            // Call the callback function with required parameters
            if (callback) {
                callback(addRight, editRight, deleteRight, viewRight, additional);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error fetching menu options:', errorThrown);
        }
    });
};