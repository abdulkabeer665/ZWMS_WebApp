var yourToken = localStorage.getItem('yourToken');
var loginName = localStorage.getItem('loginName');
var roleGUID;
var menuID;

$(window).on('load', function () {

    $('.loader').show();
    roleGUID = localStorage.getItem('RoleID');
    menuID = localStorage.getItem('menuID');
    $('.datepicker').datepicker();
    loadGridAjax();

});

function loadGridAjax() {
    $.ajax({
        url: $('#url_local').val() + "/api/InventoryPeriods/GetAllInventoryPeriods",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({
            "GET": 1,
            "Web": 1

        }), // Adjust the payload format based on your API
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

    })
}

$('#cls').click(function () {
    $('#modal-lg').modal('hide');
});

$('#btnclose').click(function () {
    $('#modal-lg').modal('hide');
});

function FillGridHandler(response) {

    var btnedit_ = 0;
    var btndel_ = 0;
    var btnadd_ = "btnadd";

    getMenuOptions(roleGUID, menuID, yourToken, function (rights) {

        // Bind the body after getMenuOptions completes successfully
        Bindbody(response, 'tblInventory', rights["Edit"], rights["Delete"]);

        // Handle btnadd_ based on hasRight and btnadd_ status
        if (btnadd_ == "btnadd" && rights["Add"] == 1) {

            //$('#' + btnadd_).prop('disabled', false);
            $('#' + btnadd_).css('display', 'block');
        }
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
            Edit_R = "<button class='btn btn-primary'>  <i  class=\"fa fa-edit \"  title=\"Edit\"  onclick=Edit('" + json[i].inventoryPeriodID + "')></i></button>";
            //Edit_R = "<i class=\"fas fa-edit\" style='cursor: pointer;' title=\"Edit\" onclick=Edit('" + json[i].inventoryPeriodID + "')></i> ";
        }
        if (delete_rights == 1) {
            Delete_R = "<button class='btn btn-danger'> <i  class=\"fa fa-trash\"  title=\"Delete\"   onclick=Delete('" + json[i].inventoryPeriodID + "')></i> </button>";
            //Delete_R = "<i  class=\"far fa-trash-alt\" style='cursor: pointer;' title=\"Delete\" onclick=Delete('" + json[i].inventoryPeriodID + "')></i>";
        }
        tr = $('<tr/>');
        tr.append("<td  style='display: none;'>" + json[i].inventoryPeriodID + "</td>");
        tr.append("<td>" + json[i].inventoryPeriodDesc + "</td>");
        tr.append("<td>" + json[i].creationDate + "</td>");
        //tr.append("<td style='padding-top: 5px !important'> <button class='btn btn-primary'>  <i  class=\"fa fa-edit \"  title=\"Edit\"  onclick=Edit('" + i + "')></i></button> <button class='btn btn-danger'> <i  class=\"fa fa-trash\"  title=\"Delete\"   onclick=Delete('" + json[i].inventoryPeriodID + "')></i> </button></td>");
        tr.append("<td style='padding-top: 5px !important'>" + Edit_R + " " + Delete_R + "</td>");
        $("#" + tablename + ' tbody').append(tr);
    }
    $("#" + tablename).DataTable({
        "dom": '<"row justify-content-between top-information"lf>rt<"row justify-content-between bottom-information"ip><"clear">'
    });
}

$('#btnadd').click(function () {
    $('#inventoryPeriodDesc').val('');
    //$('#dateInput').val('');
    $('#btnsave').text($('#hdnsave').val());
    $('#btnsave').prop('title', 'Save');
    $('#modal-lg').modal('show');
});

$('#btnsave').click(function () {
    if ($('#inventoryPeriodDesc').val() == '') {
        alert("Inventory Period Desc must be enter.")
        return;
    }
    else {
        var flag = $('#btnsave').attr('title');
        var currentDateValue = $('#dateInput').val();
        if (flag == "Save") {

            $.ajax({
                url: $('#url_local').val() + "/api/InventoryPeriods/InsertInventoryPeriod",
                type: 'POST',
                contentType: 'application/json', // Set the content type based on your API requirements
                data: JSON.stringify({
                    "add": 1,
                    "inventoryPeriodDesc": $('#inventoryPeriodDesc').val(),
                    "inventoryDate": currentDateValue,
                    "createdBy": loginName,
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
            $.ajax({
                url: $('#url_local').val() + "/api/InventoryPeriods/UpdateInventoryPeriod",
                type: 'POST',
                contentType: 'application/json', // Set the content type based on your API requirements
                data: JSON.stringify({
                    "update": 1,
                    "inventoryPeriodID": $('#inventoryPeriodID').val(),
                    "inventoryPeriodDesc": $('#inventoryPeriodDesc').val(),
                    "creationDate": currentDateValue,
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
    }
})

function SaveHandler(response) {
    //$('#loader').hide();
    //$('#modal-lg').modal('hide');
    var str = response.message;
    if (str.includes("Already")) {
        swal({
            title: response.message + "...",
            icon: "warning",
            button: "OK",
        }).then((exist) => {
            if (exist) {
                /*loadGridAjax();*/
                window.location.href = '';
            }
        })
    }
    else {
        swal({
            title: response.message + "...",
            icon: "success",
            button: "OK",
        })
            .then((Save) => {
                if (Save) {

                    $('#modal-lg').modal('hide');
                    //loadGridAjax();
                    window.location.href = '';
                }
            })

    }
};

function Edit(value) {
    var table = $('#tblInventory').DataTable();
    var data = table.row(value).data();
    var invPeriodUID = data[0];
    $.ajax({
        url: $('#url_local').val() + "/api/InventoryPeriods/GetInventoryPeriodByID",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({
            "getByID": 1,
            "inventoryPeriodID": invPeriodUID

        }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            // Handle the successful response
            editResponseHandler(data);
            //$('.loader').hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }

    })
};

function editResponseHandler(response) {
    var onlyDate = response[0]["creationDate"].split("T")[0];
    $("#inventoryPeriodID").val(response[0]["inventoryPeriodID"]);
    $("#inventoryPeriodDesc").val(response[0]["inventoryPeriodDesc"]);
    $("#dateInput").val(onlyDate);
    $('#modal-lg').modal('show');
    $('#btnsave').prop('title', 'Update');
    $('#btnsave').text($('#hdnupdate').val());
};

function Delete(res) {
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
                url: $('#url_local').val() + "/api/InventoryPeriods/DeleteInventoryPeriod",
                type: 'POST',
                contentType: 'application/json', // Set the content type based on your API requirements
                data: JSON.stringify({
                    "inventoryPeriodID": res

                }), // Adjust the payload format based on your API
                headers: {
                    'Authorization': 'Bearer ' + yourToken
                },
                success: function (data) {
                    DeleteHandler(data);
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

function DeleteHandler(response) {
    var str = response.message;
    if (str.includes("cannot be deleted")) {
        swal({
            title: response.message + "...",
            icon: "warning",
            button: "OK",
        }).then((exist) => {
            if (exist) {
                window.location.href = '';
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
                $('#modal-lg').modal('hide');
                window.location.href = '';
            }
        })
    }
};