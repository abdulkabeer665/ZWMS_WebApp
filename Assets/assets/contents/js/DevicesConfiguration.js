var yourToken;
var loginName;
var roleGUID;
var menuID;

$(window).on('load', function () {
    yourToken = localStorage.getItem('yourToken');
    loginName = localStorage.getItem('loginName');
    roleGUID = localStorage.getItem('RoleID');
    menuID = localStorage.getItem('menuID');
    $('.loader').show();

    loadGridAjax();

});

function loadGridAjax() {
    $.ajax({
        url: $('#url_local').val() + "/api/DeviceConfiguration/GetAllDevices",
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

    var btnedit_ = 0;
    var btndel_ = 0;
    getMenuOptions(roleGUID, menuID, yourToken, function (rights) {
        Bindbody(response, 'tblDevices', rights["Edit"], rights["Delete"]);
    });
};

function Bindbody(json, tablename, edit_rights, delete_rights) {
    var tr;
    var Edit_R = "";
    var Delete_R = "";
    $("#" + tablename).DataTable().destroy();
    $("#" + tablename + ' tbody').empty();
    for (var i = 0; i < json.length; i++) {
        if (edit_rights == 1) {
            //Edit_R = "<i class=\"fas fa-edit\" style='cursor: pointer;' title=\"Edit\" onclick=Edit('" + json[i].guid + "')></i> ";
            Edit_R = "<button class='btn btn-primary'>  <i  class=\"fa fa-edit \"  title=\"Edit\"  onclick=Edit('" + json[i].guid + "')></i></button>";
        }
        if (delete_rights == 1) {
            //Delete_R = "<i  class=\"far fa-trash-alt\" style='cursor: pointer;' title=\"Delete\" onclick=Delete('" + json[i].guid + "')></i>";
            Delete_R = "<button class='btn btn-danger'> <i  class=\"fa fa-trash\"  title=\"Delete\"   onclick=Delete('" + json[i].guid + "')></i> </button>";
        }
        tr = $('<tr/>');
        tr.append("<td  style='display: none;'>" + json[i].guid + "</td>");
        tr.append("<td>" + json[i].code + "</td>");
        tr.append("<td>" + json[i].engName + "</td>");
        tr.append("<td style='display: none;'>" + json[i].name + "</td>");
        tr.append("<td>" + json[i].hardwareID + "</td>");
        tr.append("<td>" + json[i].licKey + "</td>");
        //tr.append("<td style='padding-top: 5px !important'> <button class='btn btn-primary'>  <i  class=\"fa fa-edit \"  title=\"Edit\"  onclick=Edit('" + i + "')></i></button> <button class='btn btn-danger'> <i  class=\"fa fa-trash\"  title=\"Delete\"   onclick=Delete('" + json[i].guid + "')></i> </button></td>");
        tr.append("<td style='padding-top: 5px !important'>" + Edit_R + " " + Delete_R + "</td>");
        
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

function Edit(value) {
    var table = $('#tblDevices').DataTable();
    var data = table.row(value).data();

    $('#deviceGUID').val(data[0]);
    $('#code').val(data[1]);
    $('#engName').val(data[2]);
    $('#ArName').val(data[3]);
    $('#hardwareID').val(data[4]);
    $('#licKey').val(data[5]);
    $('#modal-lg').modal('show');
    $('#btnsave').prop('title', 'Update');
    $('#btnsave').text($('#hdnupdate').val());
};

$('#btnsave').click(function () {
    var flag = $('#btnsave').attr('title');
    if (flag == "Update") {
        $.ajax({
            url: $('#url_local').val() + "/api/DeviceConfiguration/VerifyDeviceLicKeyWeb",
            type: 'POST',
            contentType: 'application/json', // Set the content type based on your API requirements
            data: JSON.stringify({
                "update": 1,
                "deviceSerialNo": $('#hardwareID').val(),
                "deviceLicKey": $('#licKey').val(),
                "lastEditBy": loginName,

            }), // Adjust the payload format based on your API
            headers: {
                'Authorization': 'Bearer ' + yourToken
            },
            success: function (data) {

                confirmUpdate(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle the error
                console.log('AJAX Error: ' + textStatus, errorThrown);
                console.log(jqXHR.responseText); // Log the response for more details
            }
        });
    }
});

function confirmUpdate(response) {

    if (response.status == "200") {
        $.ajax({
            url: $('#url_local').val() + "/api/DeviceConfiguration/UpdateDevice",
            type: 'POST',
            contentType: 'application/json', // Set the content type based on your API requirements
            data: JSON.stringify({
                "update": 1,
                "deviceGUID": $('#deviceGUID').val(),
                "engName": $('#engName').val(),
                "arName": $('#ArName').val(),
                "deviceLicKey": $('#licKey').val(),
                "lastEditBy": loginName,

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
    }
    else {

        saveHandlerInvalidKey(response)
    }
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
                url: $('#url_local').val() + "/api/DeviceConfiguration/DeleteDevice",
                type: 'POST',
                contentType: 'application/json', // Set the content type based on your API requirements
                data: JSON.stringify({
                    "update": 1,
                    "delete": 1,
                    "deviceGUID": value

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