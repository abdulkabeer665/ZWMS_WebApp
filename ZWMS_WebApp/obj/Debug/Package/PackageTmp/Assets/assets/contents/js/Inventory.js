var yourToken = localStorage.getItem('yourToken');
var loginName = localStorage.getItem('loginName');
var roleGUID;
var menuID;

$(window).on('load', function () {

    $('.loader').show();
    $('.datepicker').datepicker();
    loadGridAjax();
    roleGUID = localStorage.getItem('RoleID');
    menuID = localStorage.getItem('menuID');
    filldropdownWarehouse();
    filldropdownInventoryPeriod();
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
    var btnadd_ = "btnadd";

    getMenuOptions(roleGUID, menuID, yourToken, function (rights) {
        
        // Bind the body after getMenuOptions completes successfully
        Bindbody(response, 'tblInventory', rights["Edit"], rights["Delete"], rights["Post"]);

        // Handle btnadd_ based on hasRight and btnadd_ status
        if (btnadd_ == "btnadd" && rights["Add"] == 1) {

            //$('#' + btnadd_).prop('disabled', false);
            $('#' + btnadd_).css('display', 'block');
        }
    });
};

function Bindbody(json, tablename, edit_rights, delete_rights, post_rights) {

    var columnMapping = {
        "guid": 0,
        "code": 1,
        "inventoryPeriodDesc": 2,
        "engName": 3,
        "engName1": 4,
        "inventoryDate": 5,
        "status": 6
    };

    var tr;
    var Edit_R = "";
    var Delete_R = "";
    var Post_R = "";
    $("#" + tablename).DataTable().destroy();
    $("#" + tablename + ' tbody').empty();
    for (var i = 0; i < json.length; i++) {
        if (edit_rights == 1) {
            //Edit_R = "<i class=\"fas fa-edit\" style='cursor: pointer;' title=\"Edit\" onclick=Edit('" + json[i].guid + "')></i> ";
            Edit_R = "<button class='btn btn-primary'>  <i  class=\"fa fa-edit \"  title=\"Edit\"  onclick=Edit('" + i + "')></i></button>";
        }
        if (delete_rights == 1) {
            //Delete_R = "<i  class=\"far fa-trash-alt\" style='cursor: pointer;' title=\"Delete\" onclick=Delete('" + json[i].guid + "')></i>";
            Delete_R = "<button class='btn btn-danger'> <i  class=\"fa fa-trash\"  title=\"Delete\"   onclick=Delete('" + json[i].guid + "')></i> </button>";
        }
        if (post_rights == 1) {
            if (json[i].status == "Prepared") {
                Post_R = "<button class='btn btn-success'> <i  class=\"fa fa-paper-plane\"  title=\"Post\"   onclick=Post('" + json[i].guid + "')></i> </button>";
            }
            else {
                Post_R = "<button disabled class='btn btn-success'> <i  class=\"fa fa-paper-plane\"  title=\"Post\"   onclick=Post('" + json[i].guid + "')></i> </button>";
            }
        }
        tr = $('<tr/>');
        tr.append("<td  style='display: none;'>" + json[i].guid + "</td>");
        tr.append("<td>" + json[i].code + "</td>");
        tr.append("<td>" + json[i].inventoryPeriodDesc + "</td>");
        tr.append("<td>" + json[i].engName + "</td>");
        tr.append("<td>" + json[i].engName1 + "</td>");
        tr.append("<td>" + json[i].inventoryDate + "</td>");
        tr.append("<td>" + json[i].status + "</td>");
        //if (json[i].status == "Prepared") {
        //    tr.append("<td style='padding-top: 5px !important'> <button class='btn btn-primary'>  <i  class=\"fa fa-edit \"  title=\"Edit\"  onclick=Edit('" + i + "')></i></button> <button class='btn btn-danger'> <i  class=\"fa fa-trash\"  title=\"Delete\"   onclick=Delete('" + json[i].guid + "')></i> </button><button style='margin-left: 5px;' class='btn btn-success'> <i  class=\"fa fa-paper-plane\"  title=\"Post\"   onclick=Post('" + json[i].guid + "')></i> </button></td>");
        //}
        //else {
        //    tr.append("<td style='padding-top: 5px !important'> <button class='btn btn-primary'>  <i  class=\"fa fa-edit \"  title=\"Edit\"  onclick=Edit('" + i + "')></i></button> <button class='btn btn-danger'> <i  class=\"fa fa-trash\"  title=\"Delete\"   onclick=Delete('" + json[i].guid + "')></i> </button><button disabled style='margin-left: 5px;' class='btn btn-success'> <i  class=\"fa fa-paper-plane\"  title=\"Post\"   onclick=Post('" + json[i].guid + "')></i> </button></td>");
        //}
        tr.append("<td style='padding-top: 5px !important'>" + Edit_R + " " + Delete_R + " " + Post_R + "</td>");
        $("#" + tablename + ' tbody').append(tr);
    };
    var orderColumn = columnMapping["engName"]; // Use the column name to get the index
    $("#" + tablename).DataTable(
        {
            "order": [[orderColumn, 'asc']], // Order by the calculated column index. For no order use "order": [],
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
    $('#invPeriodSelect').val(0);
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

};

function filldropdownInventoryPeriod() {

    $.ajax({
        url: $('#url_local').val() + "/api/InventoryPeriods/GetAllInventoryPeriods",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({ "GET": 1, "Web": 1 }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            // Handle the successful response
            
            ddInventoryPeriodHandler(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }
    });

};

function ddlHandler(response) {
    fillddls('warehouse', 'Please Select Warehouse', response)
};

function ddInventoryPeriodHandler(response) {
    fillddInventoryPeriod('invPeriodSelect', 'Please Select Inventory Period', response)
};

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
};

function fillddInventoryPeriod(name, selecttext, data) {
    $("#" + name).empty();
    var s = '<option value="0">' + selecttext + '</option>';
    $.each(data, function (index, item) {
        s += '<option value="' + item.inventoryPeriodID + '">' + item.inventoryPeriodDesc + '</option>';

    });
    $("#" + name).html(s);
};

$("#warehouse").change(function () {
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
    
    //This logic is removed because the customer can create multiple inventories for a location event the previous is in Prepared Mode --------- Dated: 28/05/2024
    //console.log(response)
    //if (response.message.includes("already has prepared")) {
    //    swal({

    //        title: "Error!",
    //        text: response.message,
    //        icon: "warning",
    //        button: "OK",
    //    });
    //    $('#warehouse').val(0);
    //}
    //else {
        $('#code').val(response.code)
    //}
    
}

$('#btnsave').click(function () {
    
    if ($('#enName').val() == '') {
        alert("Eng Name must be enter.")
        return;
    }
    else if ($('#warehouse').val() == 0)
    {
        alert("Warehouse must be selected.")
        return;
    }
    else if ($('#invPeriodSelect').val() == 0) {
        alert("Inventory Period must be selected.")
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
                //Insert krne p layout dark ho rahi h

            $.ajax({
                url: $('#url_local').val() + "/api/Inventory/InsertInventory",
                type: 'POST',
                contentType: 'application/json', // Set the content type based on your API requirements
                data: JSON.stringify({
                    "add": 1,
                    "engName": $('#enName').val(),
                    "name": $('#arName').val(),
                    "warehouseGUID": $('#warehouse').val(),
                    "name": $('#arName').val(),
                    "code": $('#code').val(),
                    "inventoryDate": currentDateValue,
                    "createdBy": loginName,
                    "lastEditBy": loginName,
                    "inventoryPeriodID": $('#invPeriodSelect').val(),

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
                    "lastEditBy": loginName,
                    "inventoryPeriodID": $('#invPeriodSelect').val(),

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

    var str = response.message;
    var status = response.status;
    if (str.includes("Already")) {
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
    else if (status == "406") {
        swal({
            title: response.message + "...",
            icon: "warning",
            button: "OK",
        }).then((Save) => {
            if (Save) {
                $('#modal-lg').modal('hide');
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
    $("#invPeriodSelect").val(response[0]["inventoryPeriodID"]);
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

                    if (data.message.includes("Posted inventory won't be deleted")) {
                        swal({
                            title: data.message + "...",
                            icon: "warning",
                            button: "OK",
                        }).then((exist) => {
                            if (exist) {
                                window.location.href = '';
                            }
                        })
                    }
                    else if (data.message.includes("There are 0")) {
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

                                $.ajax({
                                    url: $('#url_local').val() + "/api/Inventory/DeleteInventory",
                                    type: 'POST',
                                    contentType: 'application/json', // Set the content type based on your API requirements
                                    data: JSON.stringify({
                                        "inventoryGUID": res,
                                        "update": 1,
                                        "delete": 1,
                                        "sure": 1

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

function Post(res) {
    
    swal({
        title: "Are you sure?",
        text: "You won't revert to 'Prepared' this inventory again!",
        icon: "warning",
        buttons: [
            'No, cancel it!',
            'Yes, I am sure!'
        ],
        dangerMode: true,
    }).then(function (isConfirm) {
        if (isConfirm) {
            $('.loader').show();
            
            
            $.ajax({
                url: $('#url_local').val() + "/api/Inventory/GetInventoryByGUID",
                type: 'POST',
                contentType: 'application/json', // Set the content type based on your API requirements
                data: JSON.stringify({
                    "getByGUID": 1,
                    "inventoryGUID": res

                }), // Adjust the payload format based on your API
                headers: {
                    'Authorization': 'Bearer ' + yourToken
                },
                success: function (data) {
                    
                    var locationGUID = data[0]["warehouseGUID"];
                    var inventoryPeriodID = data[0]["inventoryPeriodID"];
                    var archiveDate = getSQLDateTime();
                   
                    $.ajax({
                        url: $('#url_local').val() + "/api/Inventory/UpdateInventoryStatus",
                        type: 'POST',
                        contentType: 'application/json', // Set the content type based on your API requirements
                        data: JSON.stringify({
                            "inventoryGUID": res,
                            "warehouseGUID": locationGUID,
                            "inventoryPeriodID": inventoryPeriodID,
                            "archiveDate": archiveDate
                        }), // Adjust the payload format based on your API
                        headers: {
                            'Authorization': 'Bearer ' + yourToken
                        },
                        success: function (data) {
                            SaveHandler(data)
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            // Handle the error
                            console.log('AJAX Error: ' + textStatus, errorThrown);
                            console.log(jqXHR.responseText); // Log the response for more details
                        }
                    });

                    //$('.loader').hide();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // Handle the error
                    console.log('AJAX Error: ' + textStatus, errorThrown);
                    console.log(jqXHR.responseText); // Log the response for more details
                }
            })
        }
        else {
            swal("Cancelled", "Your record is safe!", "error");
        }
    })
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
}