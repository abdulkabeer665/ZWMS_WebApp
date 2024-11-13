var yourToken = localStorage.getItem('yourToken');
var loginName = localStorage.getItem('loginName');
roleGUID = localStorage.getItem('RoleID');
roleNameA = localStorage.getItem('roleName');
$("#roleName").text(roleNameA);  // Use .text() to set the text content
menuID = localStorage.getItem('menuID');
var json = {
    data: []
};

$(window).on('load', function () {

    var editRoleID = localStorage.getItem("editRoleID");
    
    loadRights(editRoleID);

});

function loadRights(value) {
    $.ajax({
        url: $('#url_local').val() + "/api/Roles/GetRoleInfoByRoleID",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({
            "roleID": value
        }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            // Handle the successful response
            AccordionHandler(data);
            //$('.loader').hide();      //Work on this later 
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }
    })
};

function AccordionHandler(response) {

    var html = "";
    var option = "";

    for (var i = 0; i < response.masterMenu.length; i++) {
        var id = 0; 
        id = i + 1;
        if (response.masterMenu[i]["masterMenu"] != "DASHBOARD") {
            html += '<div class="accordion" id="inventoryAccordion' + id + '">';
            html += '<div class="accordion-item">';
            html += '<h2 class="accordion-header" id="headingInventory' + id + '">';
            html += '<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseInventory' + id + '" aria-expanded="true" aria-controls="collapseInventory' + id + '" style="font-weight: 800;">';

            html += response.masterMenu[i]["masterMenu"];
            html += '</button>';
            html += '</h2>';
            html += '<div id="collapseInventory' + id + '" class="accordion-collapse collapse show" aria-labelledby="headingInventory" data-bs-parent="#inventoryAccordion' + id + '">';
            html += '<div class="accordion-body">';
            html += '<div class="row">';
            for (var j = 0; j < response.childMenu.length; j++) {
                if (response.childMenu[j]["masterMenuID"] == response.masterMenu[i]["masterMenuID"]) {
                    html += '<div class="col-sm-5" style="font-weight: 500; margin-top: 5px;"><i style="font-size: larger; position: relative; top: 2px;" class="' + response.childMenu[j]["icon"] + '"></i> ' + response.childMenu[j]["menuName"] + '</div>';
                    for (var k = 0; k < response.options.length; k++) {
                        if (response.options[k]["menuID"] == response.childMenu[j]["menuID"]) {
                            for (var l = 0; l < response.menuRights.length; l++) {

                                if (response.menuRights[l]["optionID"] == response.options[k]["optionID"]) {

                                    if (response.childMenu[j]["menuName"].includes(" Data")) {
                                        if (response.menuRights[l]["value"] === 1) {

                                            option += '<div class="col-sm-1" style="margin-top: 3px;">' +
                                                '<input style="margin-top: 3px;" type="checkbox" ' +
                                                'onclick="handleCheckboxClick(' + response.menuRights[l]["roleAsingmentID"] + ', \'' + response.menuRights[l]["roleID"] + '\', \'' + response.menuRights[l]["value"] + '\', this)" checked/> ' +
                                                response.options[k]["optionName"] +
                                                '</div>';
                                            option += '<div style="height: 0.1px;"></div>'; // Adds a 0.1px vertical space

                                        }
                                        else {

                                            option += '<div class="col-sm-1" style="margin-top: 3px;">' +
                                                '<input style="margin-top: 3px;" type="checkbox" ' +
                                                'onclick="handleCheckboxClick(' + response.menuRights[l]["roleAsingmentID"] + ', \'' + response.menuRights[l]["roleID"] + '\', \'' + response.menuRights[l]["value"] + '\', this)"/> ' +
                                                response.options[k]["optionName"] +
                                                '</div>';
                                            option += '<div style="height: 0.1px;"></div>'; // Adds a 0.1px vertical space

                                        }
                                    }
                                    else {

                                        if (response.menuRights[l]["value"] === 1) {
                                            option += '<div class="col-sm-1" style="margin-top: 3px;">' +
                                                '<input style="margin-top: 3px;" type="checkbox" ' +
                                                'onclick="handleCheckboxClick(' + response.menuRights[l]["roleAsingmentID"] + ', \'' + response.menuRights[l]["roleID"] + '\', \'' + response.menuRights[l]["value"] + '\', this)" checked/> ' +
                                                response.options[k]["optionName"] +
                                                '</div>';
                                        } else {
                                            option += '<div class="col-sm-1" style="margin-top: 3px;">' +
                                                '<input style="margin-top: 3px;" type="checkbox" ' +
                                                'onclick="handleCheckboxClick(' + response.menuRights[l]["roleAsingmentID"] + ', \'' + response.menuRights[l]["roleID"] + '\', \'' + response.menuRights[l]["value"] + '\', this)" /> ' +
                                                response.options[k]["optionName"] +
                                                '</div>';
                                        }
                                    }
                                }

                            }
                        }
                    }
                    html = html + option;
                    option = "";
                }
            }
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '<br />';
            $('#rightsDIV').append(html);
        }
        html = "";
    }
}

$("#btnSubmit").click(function () {
    
    var date = getSQLDateTime();  // Get the current date in the SQL format (if needed)

    if (json.data.length === 0) {
        swal({
            title: "Details updated successfully!",
            icon: "success",
            button: "OK",
        }).then((Save) => {
            if (Save) {

                window.location.href = '';

            }
        });
        return;
    }
    else {
        // Prepare the payload object in the required structure
        var payload = {
            "roleAssignOptions_list": json.data.map(function (item) {
                return {
                    "RoleAsingmentID": item.roleAsingmentID,
                    "RoleID": item.roleID,                // Assuming 'roleID' is a string in 'json'
                    "Value": item.value
                };
            }),
            "LastEditBy": loginName,                  // Assuming 'loginName' is defined in your JS
            "LastEditDate": date                      // Assuming 'date' is correctly formatted
        };
        // Perform the AJAX request
        $.ajax({
            url: $('#url_local').val() + "/api/Roles/UpdateAppRole",
            type: 'POST',
            contentType: 'application/json',  // Ensure the correct content type
            data: JSON.stringify(payload),    // Only stringify the final payload object
            headers: {
                'Authorization': 'Bearer ' + yourToken  // Ensure the token is correctly passed
            },
            success: function (data) {

                UpdateRoleHandler(data);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle the error
                console.log('AJAX Error: ' + textStatus, errorThrown);
                console.log(jqXHR.responseText);  // Log the response for more details
            }
        });
    }    
});

// Function to handle checkbox clicks and update the JSON
function handleCheckboxClick(roleAsingmentID, roleID, value, checkbox) {

    // Ensure json.roleAssignOptions_list is initialized properly (if it's undefined for some reason)
    if (!json || !json.data) {
        json = { data: [] };  // Initialize if it's not already
    }

    // If the checkbox is checked, set value to 1, otherwise set value to 0
    var newValue = checkbox.checked ? 1 : 0;

    // Check if the record already exists in json.roleAssignOptions_list
    var existingRecordIndex = json.data.findIndex(item => item.roleAsingmentID === roleAsingmentID);

    if (existingRecordIndex !== -1) {
        // If it exists, update the record with the new value (0 or 1)
        json.data[existingRecordIndex] = {
            "roleAsingmentID": roleAsingmentID,
            "roleID": roleID,
            "value": newValue
        };

    } else {
        // If it doesn't exist, add a new record to json.roleAssignOptions_list
        json.data.push({
            "roleAsingmentID": roleAsingmentID,
            "roleID": roleID,
            "value": newValue
        });
        //console.log("Checkbox " + (checkbox.checked ? "checked" : "unchecked") + ": Added to JSON");
    }

    //// Log the updated JSON to the console
    //console.log("Updated JSON:", JSON.stringify(json, null, 2));
};

function getSQLDateTime() {
    const now = new Date();

    const pad = (num) => num.toString().padStart(2, '0');
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};

function UpdateRoleHandler(response) {

    var str = response.message;
    if (str.includes("Already")) {
        swal({
            title: response.message + "...",
            icon: "warning",
            button: "OK",
        }).then((exist) => {
            if (exist) {
                window.location.href = '';
            }
        });
    }
    else {
        swal({
            title: response.message + "...",
            icon: "success",
            button: "OK",
        }).then((Save) => {
            if (Save) {
                $('#modal-lg').modal('hide');
                window.location.href = '';
            }
        });
    }
};