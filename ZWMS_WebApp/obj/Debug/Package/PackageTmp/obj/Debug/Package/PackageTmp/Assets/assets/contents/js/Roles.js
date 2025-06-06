var yourToken = localStorage.getItem('yourToken');
var loginName = localStorage.getItem('loginName');
roleGUID = localStorage.getItem('RoleID');
menuID = localStorage.getItem('menuID');

$(window).on('load', function () {

    $('.loader').show();
    $('.datepicker').datepicker();
    loadGridAjax();

});

function loadGridAjax() {
    $.ajax({
        url: $('#url_local').val() + "/api/Roles/GetAllAppRoles",
        type: 'GET',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({ }), // Adjust the payload format based on your API
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

    // Call getMenuOptions and pass a callback function to execute on success
    getMenuOptions(roleGUID, menuID, yourToken, function (rights) {
        
        // Bind the body after getMenuOptions completes successfully
        Bindbody(response, 'tblRoles', rights["Edit"], rights["Delete"], rights["Rights"]);

        // Handle btnadd_ based on hasRight and btnadd_ status
        if (btnadd_ == "btnadd" && rights["Add"] == 1) {

            //$('#' + btnadd_).prop('disabled', false);
            $('#' + btnadd_).css('display', 'block');
        }
    });
};

function Bindbody(json, tablename, edit_rights, delete_rights, rights_rights) {
    
    var tr;
    var Edit_R = "";
    var Delete_R = "";
    var Rights_R = "";
    $("#" + tablename).DataTable().destroy();
    $("#" + tablename + ' tbody').empty();
    
    for (var i = 0; i < json.length; i++) {

        if (edit_rights == 1) {
            // Adding both guid and index (i) to the onclick function
            Edit_R = "<button class='btn btn-primary'>  <i  class=\"fa fa-edit\"  title=\"Edit\"  onclick=Edit('" + i + "')></i></button>";
        }
        if (delete_rights == 1) {
            Delete_R = "<button class='btn btn-danger'> <i  class=\"fa fa-trash\"  title=\"Delete\"   onclick=Delete('" + json[i].guid + "')></i> </button>";
        }
        if (rights_rights == 1) {
            Rights_R = "<button class='btn btn-success'> <i class=\"ri-spy-line\" title=\"Rights\" onclick=\"Rights('" + json[i].guid + "', " + i + ")\"></i> </button>";
        }
        tr = $('<tr/>');
        tr.append("<td  style='display: none;'>" + json[i].guid + "</td>");
        tr.append("<td>" + json[i].code + "</td>");
        tr.append("<td>" + json[i].roleName + "</td>");
        tr.append("<td>" + json[i].arName + "</td>");
        tr.append("<td style='padding-top: 5px !important'>" + Edit_R + " " + Delete_R + " " + Rights_R + "</td>");
        $("#" + tablename + ' tbody').append(tr);
    };
    $("#" + tablename).DataTable(
    {
        "dom": '<"row justify-content-between top-information"lf>rt<"row justify-content-between bottom-information"ip><"clear">'
    });
};

$('#btnadd').click(function () {
    
    $('#code').val('');
    $('#enName').val('');
    $('#arName').val('');
    $('#notes').val('');
    $('#btnsave').text($('#hdnsave').val());
    $('#btnsave').prop('title', 'Save');
    $('#modal-lg').modal('show');

});

$('#btnsave').click(function () {

    if ($('#enName').val() == '') {
        alert("Eng Name must be enter.")
        return;
    }
    
    else if ($('#code').val() == '') {
        alert("Code must be enter.")
        return;
    }
    else {
        var flag = $('#btnsave').attr('title');
        var creationDate = getSQLDateTime();

        if (flag == "Save") {
            //Insert krne p layout dark ho rahi h

            $.ajax({
                url: $('#url_local').val() + "/api/Roles/InsertAppRole",
                type: 'POST',
                contentType: 'application/json', // Set the content type based on your API requirements
                data: JSON.stringify({
                    "engName": $('#enName').val(),
                    "arName": $('#arName').val(),
                    "notes": $('#notes').val(),
                    "name": $('#arName').val(),
                    "code": $('#code').val(),
                    "lastEditDate": creationDate,
                    "creationDate": creationDate,
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
                url: $('#url_local').val() + "/api/Roles/UpdateAppRoleInfo",
                type: 'POST',
                contentType: 'application/json', // Set the content type based on your API requirements
                data: JSON.stringify({
                    "GUID": $('#guid').val(),
                    "code": $('#code').val(),
                    "engName": $('#enName').val(),
                    "arName": $('#arName').val(),
                    "notes": $('#notes').val(),
                    "lastEditDate": creationDate,
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

function Edit(loopValue) {
    var table = $('#tblRoles').DataTable();
    var data = table.row(loopValue).data();
    $("#guid").val(data[0])
    $("#code").val(data[1])
    $("#enName").val(data[2])
    $("#arName").val(data[3])
    $('#modal-lg').modal('show');
    $('#btnsave').prop('title', 'Update');
    $('#btnsave').text($('#hdnupdate').val());
};

function Rights(value, loopValue) {
    var table = $('#tblRoles').DataTable();
    var data = table.row(loopValue).data();
    localStorage.setItem("editRoleID", value);
    localStorage.setItem("roleName", data[2]);
    window.location.href = $('#url_local_front').val() + "/Roles/RoleRights";
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
                url: $('#url_local').val() + "/api/Roles/DeleteAppRole",
                type: 'POST',
                contentType: 'application/json', // Set the content type based on your API requirements
                data: JSON.stringify({
                    "GUID": res,
                    "delete": 1

                }), // Adjust the payload format based on your API
                headers: {
                    'Authorization': 'Bearer ' + yourToken
                },
                success: function (data) {
                    //console.log(data);
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

function SaveHandler(response) {

    var str = response.message;
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