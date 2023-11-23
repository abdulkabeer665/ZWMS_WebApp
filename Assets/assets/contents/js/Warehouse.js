var yourToken
$(window).on('load', function () {
    yourToken = sessionStorage.getItem('yourToken')
    filldropdownWarehouseType();
    filldropdownWarehouse();
    //debugger
    //console.log("here ==== Authorization : Bearer " + yourToken);
    //Common.Ajax('POST', $('#url_local').val() + "/api/Warehouse/GetAllWarehouses", "{ \"GET\": 1 }", 'json', FillGridHandler });
    $('.loader').show();
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

})
function FillGridHandler(response) {
    //console.log("=================>");
    //console.log(response);
    //debugger

    var btnedit_ = 0;
    var btndel_ = 0;
    var btnadd_ = "";

    Bindbody(response, 'tblWarehouse', "1", "1");
    if (btnadd_ == "btnadd" && hasrigth == 1) {
        $('#' + btnadd_).prop('disabled', false);
    }
};
function Bindbody(json, tablename, edit_rights, delete_rights) {
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
        tr.append("<td>" + json[i].warehouseEngName + "</td>");
        tr.append("<td>" + json[i].warehouseTypeEngName + "</td>");
        //tr.append("<td>" + json[i].engName1 + "</td>");
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
    //$('#btnsave').text($('#hdnsave').val());
    //$('#btnsave').prop('title', 'Save');
    //$('#HieLevelCode').val('');
    //$('#exampleModalLargetext').text("Level Creation");
    //('#HieLevelDesc').val('');
    filldropdownWarehouseType()
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
    //debugger
    //console.log(value)
    var table = $('#tblWarehouse').DataTable();
    var data = table.row(value).data();
    //console.log(data)

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
    console.log(data)
    $('#waretype').val(data[0]["warehouseTypeGUID"]);
    $('#mainWarehouseddl').val(data[0]["mainWarehouseGUID"]);
    $('#returnWarehouseddl').val(data[0]["returnWarehouseGUID"]);
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

}
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

}
function dropdownHandler(res) {
    filldropdown('waretype', 'Please Warehouse Type', res)
}

function filldropdown(name, selecttext, data) {
    //console.log(data)
    $("#" + name).empty();
    var s = '<option value="0">' + selecttext + '</option>';
    //for (var i = 0; i < data.length; i++) {
    //    s += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
    //}
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
    //console.log(data)
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