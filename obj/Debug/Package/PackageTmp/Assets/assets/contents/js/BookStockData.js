var loginUserGUID = sessionStorage.getItem('loginUserGUID');
var yourToken = sessionStorage.getItem('yourToken')

$(document).ready(function () {
    filldropdownInventoryPeriod()
    loadWarehouseDDL('');
});

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

function ddInventoryPeriodHandler(response) {
    fillddInventoryPeriod('invPeriodSelect', 'Please Select Inventory Period', response)
};

function fillddInventoryPeriod(name, selecttext, data) {
    $("#" + name).empty();
    var s = '<option value="0">' + selecttext + '</option>';
    $.each(data, function (index, item) {
        s += '<option value="' + item.inventoryPeriodID + '">' + item.inventoryPeriodDesc + '</option>';
    });
    $("#" + name).html(s);
};

$("#invPeriodSelect").change(function () {
    var selectedInvPeriod = $("#invPeriodSelect").val();

    $.ajax({
        url: $('#url_local').val() + "/api/Import/GetWarehouseByInventoryPeriodID",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({ "inventoryPeriodID": selectedInvPeriod }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            // Handle the successful response

            loadWarehouseDDL(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }
    });

});

function loadWarehouseDDL(response) {
    fillddWarehouse('invPeriodwiseLocation', 'Please Select Location', response)
};

function fillddWarehouse(name, selecttext, data) {
    $("#" + name).empty();
    var s = '<option value="0">' + selecttext + '</option>';
    $.each(data, function (index, item) {
        s += '<option value="' + item.guid + '">' + item.location + '</option>';
    });
    $("#" + name).html(s);
};

$("#invPeriodwiseLocation").change(function () {
    $(".loader").show();

    var locGUIDVal = $("#invPeriodwiseLocation").val();

    if (locGUIDVal == '0') {
        $.ajax({
            url: $('#url_local').val() + "/api/Dashboard/GetBookStockDataAgainstWarehouseGUID",
            type: 'POST',
            contentType: 'application/json', // Set the content type based on your API requirements
            data: JSON.stringify({
                "warehouseGUID": ''
            }), // Adjust the payload format based on your API
            headers: {
                'Authorization': 'Bearer ' + yourToken
            },
            success: function (data) {
                // Handle the successful response

                Bindbody(data, 'data-table');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle the error
                console.log('AJAX Error: ' + textStatus, errorThrown);
                console.log(jqXHR.responseText); // Log the response for more details
                $(".loader").hide();
            }
        });
    }
    else {
        $.ajax({
            url: $('#url_local').val() + "/api/Dashboard/GetBookStockDataAgainstWarehouseGUID",
            type: 'POST',
            contentType: 'application/json', // Set the content type based on your API requirements
            data: JSON.stringify({
                "warehouseGUID": locGUIDVal
            }), // Adjust the payload format based on your API
            headers: {
                'Authorization': 'Bearer ' + yourToken
            },
            success: function (data) {
                // Handle the successful response

                Bindbody(data, 'data-table');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle the error
                console.log('AJAX Error: ' + textStatus, errorThrown);
                console.log(jqXHR.responseText); // Log the response for more details
                $(".loader").hide();
            }
        });
    }

});

function Bindbody(json, tablename) {
    var tr;
    $("#" + tablename).DataTable().destroy();
    $("#" + tablename + ' tbody').empty();
    for (var i = 0; i < json.length; i++) {

        tr = $('<tr/>');
        tr.append("<td>" + json[i].item_Code + "</td>");
        tr.append("<td>" + json[i].bookStockInventory + "</td>");
        tr.append("<td>" + json[i].unitCostPrice + "</td>");
        $("#" + tablename + ' tbody').append(tr);
    }
    $("#" + tablename).DataTable(
        {
            "dom": '<"row justify-content-between top-information"lf>rt<"row justify-content-between bottom-information"ip><"clear">'
        });

    $(".loader").hide();

}
