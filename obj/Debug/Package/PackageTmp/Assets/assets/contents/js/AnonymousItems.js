var yourToken = sessionStorage.getItem('yourToken')
var loginName = sessionStorage.getItem('loginName')

$(window).on('load', function () {

    //Common.Ajax('POST', $('#url_local').val() + "/api/Warehouse/GetAllWarehouses", "{ \"GET\": 1 }", 'json', FillGridHandler });
    $('.loader').show(); 
    $.ajax({
        url: $('#url_local').val() + "/api/AnonymousItems/GetAllAnonymousItems",
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

    })
  //  $('.datepicker').datepicker();
});

function FillGridHandler(response) {
   
    console.log(response);

    var btnedit_ = 0;
    var btndel_ = 0;
    var btnadd_ = "";

    Bindbody(response, 'tblAnonymous', "1", "1");
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
        tr.append("<td>" + json[i].barcode + "</td>");
        tr.append("<td>" + json[i].itemName + "</td>");
        tr.append("<td>" + json[i].inventoryName + "</td>");
        tr.append("<td>" + json[i].deviceName + "</td>");
        tr.append("<td style='display: none;'>" + json[i].imageBase64 + "</td>");
        //tr.append("<td>" + json[i].deviceName + "</td>");
        //tr.append("<td>" + json[i].inventoryDate + "</td>");
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
    $('#img').attr('src', '');
   // $('#exampleModalLargetext').text("Level Updation");
    var table = $('#tblAnonymous').DataTable();
    var data = table.row(value).data();
    //console.log(data);
    $('#guid').val(data[0]);
    $('#name').val(data[1]);
   // $('#HieLevelDesc').val(data[1]);
    //alert(data[0]);
    $('#modal-lg').modal('show');
    $('#btnsave').prop('title', 'Update');
    $('#btnsave').text($('#hdnupdate').val());
    loadimage();
};

function loadimage() {
    console.log($('#guid').val())
    $('.loader').show(); 
    $.ajax({
        url: $('#url_local').val() + "/api/AnonymousItems/GetAnonymousItemByGUID",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({
            "getByGUID": 1,
            "anonymousItemGUID": $('#guid').val()
        }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            console.log("---------------- hewrrr")
            console.log(data)
            console.log(data[0]["imageBase64"])
            // Handle the successful response
           // var base64Image = 'data: ' + data[0]["imageBase64"]+''; // Replace with your base64 image data


            $('#img').attr('src', 'data:image/png;base64,' + data[0]["imageBase64"]);
            $('.loader').hide(); 
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }

    })
}

$('#btnsave').click(function () {
    if ($('#name').val() == '') {
        swal({

            title: "name must be enter",
            icon: "warning",
            button: "OK",
        });
    }
    else {
        var flag = $('#btnsave').attr('title');
        if (flag == "Save") {
            $('#modal-lg').modal('hide');
            $('#loader').show();
            //console.log("clicked")
            Common.Ajax('POST', $('#url_local').val() + "/api/Levels/addlevels", "{ \"desc\": \"" + $("#HieLevelDesc").val() + "\", \"companyid\": \"1\",\"add\":\"1\" }", 'json', EditRes);
        }
        else {

            $('#modal-lg').modal('hide');
            $.ajax({
                url: $('#url_local').val() + "/api/Inventory/InsertInventory",
                type: 'POST',
                contentType: 'application/json', // Set the content type based on your API requirements
                data: JSON.stringify({
                    "update": 1,
                    "anonymousItemGUID": $('#guid').val(),
                    "engName": $('#name').val(),
                    "imageimageBase64": $('#image').text(),
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
    loadGridAjax();
});


function SaveHandler(response) {
    /*  $('#modal-lg').modal('hide');*/
    //$('#loader').hide();
    console.log(response)
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