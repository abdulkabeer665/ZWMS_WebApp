var yourToken = localStorage.getItem('yourToken');
var loginName = localStorage.getItem('loginName');
var roleGUID;
var menuID;

$(window).on('load', function () {
    roleGUID = localStorage.getItem('RoleID');
    menuID = localStorage.getItem('menuID');
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

    
    var btnedit_ = 0;
    var btndel_ = 0;
    var btnadd_ = "btnadd";
    // Call getMenuOptions and pass a callback function to execute on success
    getMenuOptions(roleGUID, menuID, yourToken, function (rights) {
        
        // Bind the body after getMenuOptions completes successfully
        Bindbody(response, 'tblAnonymous', rights["Edit"], rights["Delete"]);

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
            //Edit_R = "<i class=\"fas fa-edit\" style='cursor: pointer;' title=\"Edit\" onclick=Edit('" + json[i].guid + "')></i> ";
            Edit_R = "<button class='btn btn-primary'>  <i  class=\"fa fa-edit \"  title=\"Edit\"  onclick=Edit('" + json[i].guid + "')></i></button>";
        }
        if (delete_rights == 1) {
            //Delete_R = "<i  class=\"far fa-trash-alt\" style='cursor: pointer;' title=\"Delete\" onclick=Delete('" + json[i].guid + "')></i>";
            Delete_R = "<button class='btn btn-danger'> <i  class=\"fa fa-trash\"  title=\"Delete\"   onclick=Delete('" + json[i].guid + "')></i> </button>";
        }
        tr = $('<tr/>');
        tr.append("<td  style='display: none;'>" + json[i].guid + "</td>");
        tr.append("<td>" + json[i].barcode + "</td>");
        tr.append("<td>" + json[i].itemName + "</td>");
        tr.append("<td>" + json[i].inventoryName + "</td>");
        tr.append("<td>" + json[i].deviceName + "</td>");
        tr.append("<td  style='display: none;'>" + json[i].itemQty + "</td>");
        tr.append("<td  style='display: none;'>" + json[i].imageBase64 + "</td>");
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
    $('#modal-lg').modal('show');
});
$('#cls').click(function () {
    $('#modal-lg').modal('hide');
});
$('#btnclose').click(function () {
    $('#modal-lg').modal('hide');
});
function Edit(value) {
    
    $('#img').attr('src', '');
    var table = $('#tblAnonymous').DataTable();
    var data = table.row(value).data();
    $('#guid').val(data[0]);
    $('#barcode').val(data[1]);
    $('#name').val(data[2]);
    $('#itemQty').val(data[5]);
    $('#image').val(data[6]);
    $('#modal-lg').modal('show');
    $('#btnsave').prop('title', 'Update');
    $('#btnsave').text($('#hdnupdate').val());
    loadimage();
};

function loadimage() {

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
            title: "Name must be enter",
            icon: "warning",
            button: "OK",
        });
    }
    else if ($('#barcode').val() == '') {
        swal({
            title: "Barcode must be enter",
            icon: "warning",
            button: "OK",
        });
    }
    else if ($('#itemQty').val() == '') {
        swal({
            title: "Item Qty must be enter",
            icon: "warning",
            button: "OK",
        });
    }
    else {
        var flag = $('#btnsave').attr('title');
        if (flag == "Save") {
            $('#modal-lg').modal('hide');
            $('#loader').show();
            Common.Ajax('POST', $('#url_local').val() + "/api/Levels/addlevels", "{ \"desc\": \"" + $("#HieLevelDesc").val() + "\", \"companyid\": \"1\",\"add\":\"1\" }", 'json', EditRes);
        }
        else {
            $('#modal-lg').modal('hide');
            $.ajax({
                url: $('#url_local').val() + "/api/AnonymousItems/UpdateAnonymousItem",
                type: 'POST',
                contentType: 'application/json', // Set the content type based on your API requirements
                data: JSON.stringify({
                    "update": 1,
                    "anonymousItemGUID": $('#guid').val(),
                    "engName": $('#name').val(),
                    "barcode": $('#barcode').val(),
                    "itemQty": $('#itemQty').val(),
                    "imageBase64": $('#image').val(),
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
                location.href = '';
            }
        })

    }
};

function Delete(anonymousItemGUID) {
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
                url: $('#url_local').val() + "/api/AnonymousItems/DeleteAnonymousItem",
                type: 'POST',
                contentType: 'application/json', // Set the content type based on your API requirements
                data: JSON.stringify({
                    "update": 1,
                    "delete": 1,
                    "anonymousItemGUID": anonymousItemGUID,

                }), // Adjust the payload format based on your API
                headers: {
                    'Authorization': 'Bearer ' + yourToken
                },
                success: function (data) {
                    SaveHandler(data);
                    loadGridAjax();
                    
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