var yourToken;
var loginName;
var roleGUID;
var menuID;
$(window).on('load', function () {
    $('.loader').show();
    yourToken = sessionStorage.getItem('yourToken');
    loginName = sessionStorage.getItem('loginName');
    roleGUID = sessionStorage.getItem('RoleID');
    menuID = sessionStorage.getItem('menuID');
    filldropdownWarehouseType();
    filldropdownWarehouse();
    loadGridAjax();

});

function loadGridAjax() {
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
            FillGridHandler(data);
            $('.loader').hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }
    });
}

function FillGridHandler(response) {

    var btnedit_ = 0;
    var btndel_ = 0;
    var btnadd_ = "btnadd";
    // Call getMenuOptions and pass a callback function to execute on success

    getMenuOptions(roleGUID, menuID, yourToken, function (rights) {
        
        // Bind the body after getMenuOptions completes successfully
        Bindbody(response, 'tblWarehouse', rights["Edit"], rights["Delete"]);

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
            Edit_R = "<button class='btn btn-primary'>  <i  class=\"fa fa-edit \"  title=\"Edit\"  onclick=Edit('" + i + "')></i></button>";
            //Edit_R = "<i class=\"fas fa-edit\" style='cursor: pointer;' title=\"Edit\" onclick=Edit('" + json[i].guid + "')></i> ";
        }
        if (delete_rights == 1) {
            Delete_R = "<button class='btn btn-danger'> <i  class=\"fa fa-trash\"  title=\"Delete\"   onclick=Delete('" + json[i].guid + "')></i> </button>";
            //Delete_R = "<i  class=\"far fa-trash-alt\" style='cursor: pointer;' title=\"Delete\" onclick=Delete('" + json[i].guid + "')></i>";
        }

        tr = $('<tr/>');
        tr.append("<td  style='display: none;'>" + json[i].guid + "</td>");
        tr.append("<td>" + json[i].code + "</td>");
        tr.append("<td>" + json[i].warehouseEngName + "</td>");
        tr.append("<td>" + json[i].warehouseTypeEngName + "</td>");
        //tr.append("<td style='padding-top: 5px !important'>  </td>");
        //tr.append("<td style='padding-top: 5px !important'> <button class='btn btn-primary'>  <i  class=\"fa fa-edit \"  title=\"Edit\"  onclick=Edit('" + i + "')></i></button> <button class='btn btn-danger'> <i  class=\"fa fa-trash\"  title=\"Delete\"   onclick=Delete('" + json[i].guid + "')></i> </button></td>");
        tr.append("<td style='padding-top: 5px !important'>" + Edit_R + " " + Delete_R + "</td>");
       
        $("#" + tablename + ' tbody').append(tr);
    }
    $("#" + tablename).DataTable(
        {
            "dom": '<"row justify-content-between top-information"lf>rt<"row justify-content-between bottom-information"ip><"clear">'
        });
}

$('#btnadd').click(function () {

    $('#code').val('');
    $('#engName').val('');
    $('#arName').val('');
    $('#notes').val('');
    $('#keeper').val('');
    $('#phone').val('');
    $('#phone1').val('');
    $('#fax').val('');
    $('#poBox').val('');
    $('#country').val('');
    $('#city').val('');
    $('#email').val('');
    $('#website').val('');
    $('#address').val('');
    $('#modal-lg').modal('show');
    $('#btnsave').prop('title', 'Update');
    $('#btnsave').text($('#hdnupdate').val());
    //$('#btnsave').text($('#hdnsave').val());
    //$('#btnsave').prop('title', 'Save');
    //$('#HieLevelCode').val('');
    //$('#exampleModalLargetext').text("Level Creation");
    //('#HieLevelDesc').val('');

    // Get all input elements on the page
    //var inputs = document.querySelectorAll('input');
    var selects = document.querySelectorAll('select');

    // Iterate through each input element and set its value to an empty string
    //inputs.forEach(function (input) {
    //    input.value = '';
    //});

    selects.forEach(function (select) {
        select.value = '0';
    });

    $('#modal-lg').modal('show');
});

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

function Edit(value) {

    var table = $('#tblWarehouse').DataTable();
    var data = table.row(value).data();

    $.ajax({
        url: $('#url_local').val() + "/api/Warehouse/GetWarehouseByGUID",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({
            "GetByGUID": 1,
            "WarehouseGUID" : data[0]
        }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (res) {
            // Handle the successful response
            
            getData(res)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }
    });

};

function getData(data) {
    $('#waretype').val(data[0]["warehouseTypeGUID"]);
    if (data[0]["parentWarehouseGUID"] == '00000000-0000-0000-0000-000000000000') {
        $('#mainWarehouseddl').val(0);
    }
    else {
        $('#mainWarehouseddl').val(data[0]["parentWarehouseGUID"]);
    };

    if (data[0]["returnWarehouseGUID"] == '00000000-0000-0000-0000-000000000000') {
        $('#returnWarehouseddl').val(0);
    }
    else {
        $('#returnWarehouseddl').val(data[0]["returnWarehouseGUID"]);
    }

    if (data[0]["currencyEngName"] == "SR") {
        $('#currencyddl').val(1);
    }
    else if (data[0]["currencyEngName"] == null) {
        $('#currencyddl').val(0);
    }
    else {
        $('#currencyddl').val(2);
    }
    
    $('#warehouseGUID').val(data[0]["guid"]);
    $('#code').val(data[0]["code"]);
    $('#engName').val(data[0]["warehouseEngName"]);
    $('#arName').val(data[0]["warehouseArName"]);
    $('#notes').val(data[0]["notes"]);
    $('#keeper').val(data[0]["keeper"]);
    $('#phone').val(data[0]["phone"]);
    $('#phone1').val(data[0]["phone1"]);
    $('#fax').val(data[0]["fax"]);
    $('#poBox').val(data[0]["poBox"]);
    $('#country').val(data[0]["country"]);
    $('#city').val(data[0]["city"]);
    $('#email').val(data[0]["email"]);
    $('#website').val(data[0]["website"]);
    $('#address').val(data[0]["address"]);
    $('#modal-lg').modal('show');
    $('#btnsave').prop('title', 'Update');
    $('#btnsave').text($('#hdnupdate').val());

};

function filldropdownWarehouseType() {
    
    $.ajax({
        url: $('#url_local').val() + "/api/WarehouseType/GetAllWarehouseTypes",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({ "GET": 1 }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (res) {
            // Handle the successful response
           
            dropdownHandler(res);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }
    });

};

function dropdownHandler(res) {
    filldropdown('waretype', 'Please Warehouse Type', res)
}

function filldropdown(name, selecttext, data) {
    $("#" + name).empty();
    var s = '<option value="0">' + selecttext + '</option>';
    
    $.each(data, function (index, item) {
        s += '<option value="' + item.guid + '">' + item.engName + '</option>';

    });
    $("#" + name).html(s);
};

function filldropdownWarehouse() {
    $.ajax({
        url: $('#url_local').val() + "/api/Warehouse/GetAllWarehouses",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({ "GET": 1 }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (res) {
            // Handle the successful response

            dropdownWarehouseHandler(res);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }
    });
};

function dropdownWarehouseHandler(res) {
    filldllWarehouse('mainWarehouseddl', 'Please Select Warehouse', res)
    filldllWarehouse('returnWarehouseddl', 'Please Select Warehouse', res)
};

function filldllWarehouse(name, selecttext, data) {
    $("#" + name).empty();
    var s = '<option value="0">' + selecttext + '</option>';
    $.each(data, function (index, item) {
        s += '<option value="' + item.guid + '">' + item.warehouseEngName + '</option>';

    });
    $("#" + name).html(s);
};

$("#btnsave").click(function () {
    var flag = $('#btnsave').attr('title');
    var currency = "", mainwarehouse = "", returnwarehouse = "";

    if ($("#code").val() == '') {
        alert("Please insert a value in Code!");
        return;
    }

    if ($("#engName").val() == '') {
        alert("Please insert a value in En Name!");
        return;
    }

    if ($("#currencyddl").val() == "1") {
        currency = 'B0DD6DE0-7012-408F-BFB3-719ABD115AE1'
    }
    else if ($("#currencyddl").val() == "0") {
        alert("Please select currency");
        return;
    }
    else {
        currency = 'B0DD6DE0-7012-408F-BFB3-719ABD115AE1'
    }

    if ($("#mainWarehouseddl").val() == "0" || $("#mainWarehouseddl").val() == null) {
        mainwarehouse = '00000000-0000-0000-0000-000000000000';
    }
    else {
        mainwarehouse = $("#mainWarehouseddl").val()
    }

    if ($("#returnWarehouseddl").val() == "0" || $("#returnWarehouseddl").val() == null) {
        returnwarehouse = '00000000-0000-0000-0000-000000000000';
    }
    else {
        returnwarehouse = $("#returnWarehouseddl").val()
    }

    if (flag == "Update") {
        var obj = {
            update: 1,
            warehouseGUID: $("#warehouseGUID").val(),
            wHTypeGUID: $("#waretype").val(),
            code: $("#code").val(),
            engName: $("#engName").val(),
            name: $("#arName").val(),
            parentWarehouseGUID: mainwarehouse,
            currencyGUID: currency,
            returnWarehouseGUID: returnwarehouse,
            notes: $("#notes").val(),
            keeper: $("#keeper").val(),
            phone: $("#phone").val(),
            phone1: $("#phone1").val(),
            fax: $("#fax").val(),
            poBox: $("#poBox").val(),
            country: $("#country").val(),
            city: $("#city").val(),
            email: $("#email").val(),
            website: $("#website").val(),
            address: $("#address").val(),
            lastEditBy: loginName
        };

        $.ajax({
            url: $('#url_local').val() + "/api/Warehouse/UpdateWarehouse",
            type: 'POST',
            contentType: 'application/json', // Set the content type based on your API requirements
            data: JSON.stringify(obj), // Adjust the payload format based on your API
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
        $('#modal-lg').modal('hide');
        
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
    else {
        swal({
            title: response.message + "...",
            icon: "warning",
            button: "OK",
        })      
        
    }
}

function Delete(res) {
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
                url: $('#url_local').val() + "/api/Warehouse/DeleteWarehouse",
                type: 'POST',
                contentType: 'application/json', // Set the content type based on your API requirements
                data: JSON.stringify({
                    "warehouseGUID": res,
                    "update": 1,
                    "delete": 1

                }), // Adjust the payload format based on your API
                headers: {
                    'Authorization': 'Bearer ' + yourToken
                },
                success: function (data) {
                    // Handle the successful response

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
