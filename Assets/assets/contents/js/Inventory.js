﻿var yourToken = sessionStorage.getItem('yourToken')
var loginName = sessionStorage.getItem('loginName')
$(window).on('load', function () {

    $('.loader').show();
    $('.datepicker').datepicker();
    loadGridAjax();

    filldropdownWarehouse();
});

function loadGridAjax() {
    $.ajax({
        url: $('#url_local').val() + "/api/Inventory/GetAllInventories",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({
            "GET": 1,
            "web": 1

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
    //$('#btnsave').text($('#hdnsave').val());
    //$('#btnsave').prop('title', 'Save');
    //$('#HieLevelCode').val('');
    //$('#exampleModalLargetext').text("Level Creation");
    //('#HieLevelDesc').val('');
    $('#modal-lg').modal('hide');
});

$('#btnclose').click(function () {
    //$('#btnsave').text($('#hdnsave').val());
    //$('#btnsave').prop('title', 'Save');
    //$('#HieLevelCode').val('');
    //$('#exampleModalLargetext').text("Level Creation");
    //('#HieLevelDesc').val('');
    $('#modal-lg').modal('hide');
});

function FillGridHandler(response) {

    var btnedit_ = 0;
    var btndel_ = 0;
    var btnadd_ = "";

    Bindbody(response, 'tblInventory', "1", "1");
    if (btnadd_ == "btnadd" && hasrigth == 1) {
        $('#' + btnadd_).prop('disabled', false);
    }
};
function Bindbody(json, tablename, edit_rights, delete_rights) {
   
      //console.log(json)
    var tr;
    var Edit_R;
    var Delete_R;
    $("#" + tablename).DataTable().destroy();
    $("#" + tablename + ' tbody').empty();
    for (var i = 0; i < json.length; i++) {
        //console.log("================"+json.length)
        if (edit_rights == 1) {
            //    console.log("in edit")
            Edit_R = "<i class=\"fas fa-edit\" style='cursor: pointer;' title=\"Edit\" onclick=Edit('" + json[i].guid + "')></i> ";
        }
        if (delete_rights == 1) {
            Delete_R = "<i  class=\"far fa-trash-alt\" style='cursor: pointer;' title=\"Delete\" onclick=Delete('" + json[i].guid + "')></i>";
        }

        tr = $('<tr/>');
        //tr.append("<td style='display: none;'>" + json[i].id + "</td>");
        tr.append("<td  style='display: none;'>" + json[i].guid + "</td>");
        tr.append("<td>" + json[i].code + "</td>");
        tr.append("<td>" + json[i].engName + "</td>");
        tr.append("<td>" + json[i].engName1 + "</td>");
        tr.append("<td>" + json[i].inventoryDate + "</td>");
        //if (json[i].scalestatus == "1") {
        //    tr.append("<td>Active</td>");
        //}
        //else {
        //    tr.append("<td>Inactive</td>");
        //}
        tr.append("<td style='padding-top: 5px !important'> <button class='btn btn-primary'>  <i  class=\"fa fa-edit \"  title=\"Edit\"  onclick=Edit('" + i + "')></i></button> <button class='btn btn-danger'> <i  class=\"fa fa-trash\"  title=\"Delete\"   onclick=Delete('" + json[i].guid + "')></i> </button></td>");
        //tr.append("<td>" + Edit_R + Delete_R + "</td>");
        // console.log(Edit_R)
        $("#" + tablename + ' tbody').append(tr);
    }
    $("#" + tablename).DataTable(
        {
            "dom": '<"row justify-content-between top-information"lf>rt<"row justify-content-between bottom-information"ip><"clear">'
        });
}
$('#btnadd').click(function () {
    $('#code').val('');
    $('#enName').val('');
    $('#arName').val('');
    $('#warehouse').val(0);
    $('#dateInput').val('');
    document.getElementById("warehouse").disabled = false;
    $('#btnsave').text($('#hdnsave').val());
    $('#btnsave').prop('title', 'Save');
    //$('#HieLevelCode').val('');
    //$('#exampleModalLargetext').text("Level Creation");
    //('#HieLevelDesc').val('');
    $('#modal-lg').modal('show');
});
function filldropdownWarehouse() {
  
    $.ajax({
        url: $('#url_local').val() + "/api/Warehouse/GetAllWarehouses",
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

}
function ddlHandler(response) {
    // debugger;
    fillddls('warehouse', 'Please Select Warehouse', response)
}
function fillddls(name, selecttext, data) {
    //console.log("$$$$$$$$$$$$ " + data)
    $("#" + name).empty();
    var s = '<option value="0">' + selecttext + '</option>';
    //for (var i = 0; i < data.length; i++) {
    //    s += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
    //}
    $.each(data, function (index, item) {
        s += '<option value="' + item.guid + '">' + item.warehouseEngName + '</option>';

    });
    $("#" + name).html(s);
}
$("#warehouse").change(function () {
    //debugger
    var ddvalue = $('#warehouse').val()

    $.ajax({
        url: $('#url_local').val() + "/api/Inventory/GenerateInventoryCode",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({
            "warehouseGUID": ddvalue,
            "LoginName": loginName
        }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            // Handle the successful response

            ddlHandler2(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }
    });
});
function ddlHandler2(response) {
    console.log(response)
    if (response.message.includes("already has prepared")) {
        swal({

            title: "Error!",
            text: response.message,
            icon: "warning",
            button: "OK",
        });
        $('#warehouse').val(0);
    }
    else {
        $('#code').val(response.code)
    }
    
}

$('#btnsave').click(function () {
    debugger
    if ($('#enName').val() == '') {
        alert("Eng Name must be enter.")
        return;
    }
    else if ($('#warehouse').val() == 0)
    {
        alert("Warehouse must be selected.")
        return;
    }
    else if ($('#dateInput').val() == '')
    {
        alert("Date must be enter.")
        return;
    }
    else {
        var flag = $('#btnsave').attr('title');
        var currentDateValue = $('#dateInput').val();
        if (flag == "Save") {
            debugger    //Insert krne p layout dark ho rahi h

            $.ajax({
                url: $('#url_local').val() + "/api/Inventory/InsertInventory",
                type: 'POST',
                contentType: 'application/json', // Set the content type based on your API requirements
                data: JSON.stringify({
                    "add": 1,
                    "engName": $('#enName').val(),
                    "warehouseGUID": $('#warehouse').val(),
                    "name": $('#arName').val(),
                    "code": $('#code').val(),
                    "inventoryDate": currentDateValue,
                    "createdBy": loginName,
                    "lastEditBy": loginName

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
                url: $('#url_local').val() + "/api/Inventory/UpdateInventory",
                type: 'POST',
                contentType: 'application/json', // Set the content type based on your API requirements
                data: JSON.stringify({
                    "update": 1,
                    "inventoryGUID": $('#guid').val(),
                    "code": $('#code').val(),
                    "engName": $('#enName').val(),
                    "name": $('#arName').val(),
                    "warehouseGUID": $('#warehouse').val(),
                    "inventoryDate": currentDateValue,
                    "status" : "Prepared",
                    "notes": "",
                    "lastEditBy": loginName

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
    //debugger
    //$('#modal-lg').modal('hide');
    var str = response.message;
    if (str.includes("Already")) {
        swal({
            title: response.message + "...",
            icon: "warning",
            button: "OK",
        }).then((exist) => {
            if (exist) {
                loadGridAjax();
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
                    loadGridAjax();
                }
            })

    }
};

function Edit(value) {
    var table = $('#tblInventory').DataTable();
    var data = table.row(value).data();
    var invGUID = data[0];
    $.ajax({
        url: $('#url_local').val() + "/api/Inventory/GetInventoryByGUID",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({
            "getByGUID": 1,
            "inventoryGUID": invGUID

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
    var onlyDate = response[0]["inventoryDate"].split("T")[0];
    document.getElementById("warehouse").disabled = true;
    $("#code").val(response[0]["code"]);
    $("#enName").val(response[0]["engName"]);
    $("#arName").val(response[0]["name"]);
    $("#guid").val(response[0]["guid"]);
    $("#warehouse").val(response[0]["warehouseGUID"]);
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
            //debugger
            $.ajax({
                url: $('#url_local').val() + "/api/Inventory/DeleteInventory",
                type: 'POST',
                contentType: 'application/json', // Set the content type based on your API requirements
                data: JSON.stringify({
                    "inventoryGUID": res

                }), // Adjust the payload format based on your API
                headers: {
                    'Authorization': 'Bearer ' + yourToken
                },
                success: function (data) {
                    //debugger
                    // Handle the successful response
                    //console.log(data)
                    //console.log(data.message.includes("There are 0"))
                    if (data.message.includes("There are 0")) {
                        $.ajax({
                            url: $('#url_local').val() + "/api/Inventory/DeleteInventory",
                            type: 'POST',
                            contentType: 'application/json', // Set the content type based on your API requirements
                            data: JSON.stringify({
                                "update": 1,
                                "delete": 1,
                                "sure": 1,
                                "InventoryGUID": res
                                

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
                        swal({
                            title: "Are you sure?",
                            text: data.message,
                            icon: "warning",
                            buttons: [
                                'No, cancel it!',
                                'Yes, Proceed!'
                            ],
                            dangerMode: true,
                        }).then(function (isConfirm) {
                            if (isConfirm) {
                                //debugger
                                $.ajax({
                                    url: $('#url_local').val() + "/api/Inventory/DeleteInventory",
                                    type: 'POST',
                                    contentType: 'application/json', // Set the content type based on your API requirements
                                    data: JSON.stringify({
                                        "inventoryGUID": res,
                                        "update": res,
                                        "delete": res,
                                        "sure": res

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


                    }
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