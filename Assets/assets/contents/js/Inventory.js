var yourToken = sessionStorage.getItem('yourToken')
var loginName = sessionStorage.getItem('loginName')
$(window).on('load', function () {
   
    console.log("here ==== Authorization : Bearer " + yourToken);
    //Common.Ajax('POST', $('#url_local').val() + "/api/Warehouse/GetAllWarehouses", "{ \"GET\": 1 }", 'json', FillGridHandler });
    $('.loader').show();
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
     $('.datepicker').datepicker();
    });

function FillGridHandler(response) {
    console.log("=================>");
    console.log(response);

    var btnedit_ = 0;
    var btndel_ = 0;
    var btnadd_ = "";

    Bindbody(response, 'tblInventory', "1", "1");
    if (btnadd_ == "btnadd" && hasrigth == 1) {
        $('#' + btnadd_).prop('disabled', false);
    }
};
function Bindbody(json, tablename, edit_rights, delete_rights) {
   
    //  console.log(json[0])
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
        tr.append("<td style='padding-top: 5px !important'> <button class='btn btn-primary'>  <i  class=\"fa fa-edit \"  title=\"Edit\"  onclick=Edit('" + i + "')></i></button> <button class='btn btn-danger'> <i  class=\"fa fa-trash\"  title=\"Delete\"   onclick=Delete('" + json[i].scaleID + "')></i> </button></td>");
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

    //$('#btnsave').text($('#hdnsave').val());
    //$('#btnsave').prop('title', 'Save');
    //$('#HieLevelCode').val('');
    //$('#exampleModalLargetext').text("Level Creation");
    //('#HieLevelDesc').val('');
    filldropdownWarehouse()
    $('#modal-lg').modal('show');
});
function filldropdownWarehouse() {
  
    // debugger;
    //Common.Ajax('POST', $('#url_local').val() + "/api/WarehouseType/GetAllWarehouseTypes", "{\"companyid\":\"1\"}", 'json', ddlHandler);
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
 
    console.log("******************")
    console.log(response)
    // debugger;
    fillddls('warehouse', 'Please Warehouse', response)
}
function fillddls(name, selecttext, data) {
    console.log("$$$$$$$$$$$$ " + data)
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
    
 
    console.log("^^^^^^^^^^^")
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
    $('#code').val(response.code)
}
function fillddls2(name, selecttext, data) {
    console.log("$$$$$$$$$$$$ " + data)
    $("#" + name).empty();
    var s = '<option value="0">' + selecttext + '</option>';
    //for (var i = 0; i < data.length; i++) {
    //    s += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
    //}
    $.each(data, function (index, item) {
        s += '<option value="' + item.guid + '">' + item.engName + '</option>';

    });
    $("#" + name).html(s);
}



$('#btnsave').click(function () {
    debugger
    if ($('#enName').val() == '') {
        swal({

            title: "Name must be enter",
            icon: "warning",
            button: "OK",
        });
    }
    else {
        var flag = $('#btnsave').attr('title');
        if (flag == "Save") {
            var currentDateValue = $('#dateInput').val();

            $('#modal-lg').modal('hide');

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
    }
})
function SaveHandler(response) {
  /*  $('#modal-lg').modal('hide');*/
    $('#loader').hide();
    "herrrrrrrrrrrrrrrre"
    console.log(response)
    $('#modal-lg').modal('hide');
    alert("success")
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
        })
            .then((Save) => {
                if (Save) {
                    location.href = '';
                }
            })

    }
    //location.href = '';
    //alert(response.detail[0].message);

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
