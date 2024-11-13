var loginUserGUID = sessionStorage.getItem('loginUserGUID');
var yourToken = sessionStorage.getItem('yourToken')

$(document).ready(function () {

    GetImportedMasterData();
});

function GetImportedMasterData() {
    
    showLoader();
    $.ajax({
        url: $('#url_local').val() + "/api/Import/GetImportMasterData", // Get the API endpoint URL
        type: 'GET',
        contentType: 'application/json',
        data: JSON.stringify({ importMasterData: data }),
        headers: { 'Authorization': 'Bearer ' + yourToken },
        success: function (response) {
            
            //console.log(response); // Log the response from the server
            BindBody(response, "tblMasterData");
            hideLoader();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            hideLoader();
            console.error('Error sending data to API:', errorThrown);
        }
    });
};

function BindBody(json, tablename) {
    var tr;
    var Edit_R;
    var Delete_R;
    $("#" + tablename).DataTable().destroy();
    $("#" + tablename + ' tbody').empty();
    for (var i = 0; i < json.length; i++) {

        tr = $('<tr/>');
        //tr.append("<td style='display: none;'>" + json[i].id + "</td>");
        tr.append("<td>" + json[i].itemCode + "</td>");
        tr.append("<td>" + json[i].engName + "</td>");
        tr.append("<td>" + json[i].category + "</td>");
        tr.append("<td>" + json[i].packageTypeCode + "</td>");
        tr.append("<td>" + json[i].packageType + "</td>");
        tr.append("<td>" + json[i].packSize + "</td>");
        tr.append("<td>" + json[i].piecesQty + "</td>");
        tr.append("<td>" + json[i].barcode + "</td>");
        tr.append("<td>" + json[i].sellingPrice + "</td>");
        tr.append("<td>" + json[i].costPrice + "</td>");
        //tr.append("<td>" + json[i].bookStock + "</td>");
        
        $("#" + tablename + ' tbody').append(tr);
    };
    //var orderColumn = columnMapping["engName"]; // Use the column name to get the index
    $("#" + tablename).DataTable(
    {
        //"order": [[orderColumn, 'asc']], // Order by the calculated column index. For no order use "order": [],
        "dom": '<"row justify-content-between top-information"lf>rt<"row justify-content-between bottom-information"ip><"clear">'
    });
};

function showLoader() {
    
    document.querySelector('.loader-container').style.display = 'block';
};

function hideLoader() {
    document.querySelector('.loader-container').style.display = 'none';
};