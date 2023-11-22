var yourToken
$(window).on('load', function () {
    yourToken = sessionStorage.getItem('yourToken');
    $('.loader').show();
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

})
function FillGridHandler(response) {

    var btnedit_ = 0;
    var btndel_ = 0;
    var btnadd_ = "";

    Bindbody(response, 'tblDevices', "1", "1");
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
        if (edit_rights == 1) {
            Edit_R = "<i class=\"fas fa-edit\" style='cursor: pointer;' title=\"Edit\" onclick=Edit('" + json[i].guid + "')></i> ";
        }
        if (delete_rights == 1) {
            Delete_R = "<i  class=\"far fa-trash-alt\" style='cursor: pointer;' title=\"Delete\" onclick=Delete('" + json[i].guid + "')></i>";
        }

        tr = $('<tr/>');
        tr.append("<td  style='display: none;'>" + json[i].guid + "</td>");
        tr.append("<td>" + json[i].code + "</td>");
        tr.append("<td>" + json[i].engName + "</td>");
        tr.append("<td>" + json[i].hardwareID + "</td>");
        tr.append("<td>" + json[i].licKey + "</td>");
        tr.append("<td style='padding-top: 5px !important'> <button class='btn btn-primary'>  <i  class=\"fa fa-edit \"  title=\"Edit\"  onclick=Edit('" + i + "')></i></button> <button class='btn btn-danger'> <i  class=\"fa fa-trash\"  title=\"Delete\"   onclick=Delete('" + json[i].guid + "')></i> </button></td>");
        
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
    //filldropdownWarehouseType()
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
    var table = $('#tblDevices').DataTable();
    var data = table.row(value).data();
    //console.log(data);

    $('#code').val(data[1]);
    $('#engName').val(data[2]);
    $('#hardwareID').val(data[3]);
    $('#licKey').val(data[4]);

    $('#modal-lg').modal('show');
    $('#btnsave').prop('title', 'Update');
    $('#btnsave').text($('#hdnupdate').val());
    //loadimage();
};

function Delete(value) {
    
};

$('#btnsave').click(function () {
    var flag = $('#btnsave').attr('title');
    if (flag == "Update") {
        $('#modal-lg').modal('hide');
        $.ajax({
            url: $('#url_local').val() + "/api/DeviceConfiguration/UpdateDevice",
            type: 'POST',
            contentType: 'application/json', // Set the content type based on your API requirements
            data: JSON.stringify({
                "update": 1,
                "GUID": $('#guid').val(),
                "code": $('#engName').val(),
                "engName": $('#engName').val(),
                //"name": $('#engName').val(),
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
});