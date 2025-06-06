﻿var loginUserGUID = localStorage.getItem('loginUserGUID');
var yourToken = localStorage.getItem('yourToken')

$(document).ready(function () {
    filldropdownInventoryPeriod()
    loadWarehouseDDL('');
    ddInventoryHandler('');
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

function filldropdownInventory() {
    var selectedWarehouseGUID = $("#invPeriodwiseLocation").val();

    if (selectedWarehouseGUID == '0') {
        selectedWarehouseGUID = '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    }

    $.ajax({
        url: $('#url_local').val() + "/api/Inventory/GetAllInventoriesByWarehouseGUID",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({ "warehouseGUID": selectedWarehouseGUID }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            // Handle the successful response
            ddInventoryHandler(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }
    });

};

function ddInventoryHandler(response) {
    fillddInventory('inventoryDD', 'Please Select Inventory', response)
};

function fillddInventory(name, selecttext, data) {
    
    $("#" + name).empty();
    var s = '<option value="0">' + selecttext + '</option>';
    $.each(data, function (index, item) {
        s += '<option value="' + item.guid + '">' + item.engName + '</option>';
    });
    $("#" + name).html(s);
};

//var locGUIDVal;
//var inventoryDD;
//var inventoryPeriod;

$("#invPeriodwiseLocation").change(function () {
    
    $(".loader").show();
    
    var locGUIDVal = $("#invPeriodwiseLocation").val();
    var inventoryDD = $("#inventoryDD").val();
    var inventoryPeriod = $("#invPeriodSelect").val();

    if (locGUIDVal == '0') {
        locGUIDVal = '';
    }
    if (inventoryDD == '0') {
        inventoryDD = '';
    }
    if (inventoryPeriod == '0') {
        inventoryPeriod = '';
    }

    //BindDataTableWithServerSide('data-table')
    loadGridAjax(locGUIDVal, inventoryDD, inventoryPeriod)
    //if (locGUIDVal == '0' && inventoryDD == '0') {

    //it is working fine
    //$.ajax({
    //    url: $('#url_local').val() + "/api/Dashboard/GetBookStockDataAgainstWarehouseGUIDandInventoryPeriod",
    //    type: 'POST',
    //    contentType: 'application/json', // Set the content type based on your API requirements
    //    data: JSON.stringify({
    //        "warehouseGUID": locGUIDVal,
    //        "inventoryGUID": inventoryDD,
    //        "inventoryPeriod": inventoryPeriod
    //    }), // Adjust the payload format based on your API
    //    headers: {
    //        'Authorization': 'Bearer ' + yourToken
    //    },
    //    success: function (data) {
    //        // Handle the successful response

    //        Bindbody(data, 'data-table');

    //    },
    //    error: function (jqXHR, textStatus, errorThrown) {
    //        // Handle the error
    //        //console.log('AJAX Error: ' + textStatus, errorThrown);
    //        //console.log(jqXHR.responseText); // Log the response for more details
    //        Bindbody([], 'data-table');
    //        $(".loader").hide();
    //    }
    //});













    //if (locGUIDVal == '0' && inventoryDD == '0') {
        //$.ajax({
        //    url: $('#url_local').val() + "/api/Dashboard/GetBookStockDataAgainstWarehouseGUID",
        //    type: 'POST',
        //    contentType: 'application/json', // Set the content type based on your API requirements
        //    data: JSON.stringify({
        //        "warehouseGUID": locGUIDVal,
        //        "inventoryGUID": inventoryDD
        //    }), // Adjust the payload format based on your API
        //    headers: {
        //        'Authorization': 'Bearer ' + yourToken
        //    },
        //    success: function (data) {
        //        // Handle the successful response
        //        Bindbody(data, 'data-table');
                
        //    },
        //    error: function (jqXHR, textStatus, errorThrown) {
        //        // Handle the error
        //        console.log('error')
        //        //console.log('AJAX Error: ' + textStatus, errorThrown);
        //        //console.log(jqXHR.responseText); // Log the response for more details
        //        Bindbody(data, 'data-table');
        //        $(".loader").hide();
        //    }
        //});
    //}
    //else {
    //    $.ajax({
    //        url: $('#url_local').val() + "/api/Dashboard/GetBookStockDataAgainstWarehouseGUID",
    //        type: 'POST',
    //        contentType: 'application/json', // Set the content type based on your API requirements
    //        data: JSON.stringify({
    //            "warehouseGUID": locGUIDVal
    //        }), // Adjust the payload format based on your API
    //        headers: {
    //            'Authorization': 'Bearer ' + yourToken
    //        },
    //        success: function (data) {
    //            // Handle the successful response

    //            Bindbody(data, 'data-table');
    //        },
    //        error: function (jqXHR, textStatus, errorThrown) {
    //            // Handle the error
    //            console.log('AJAX Error: ' + textStatus, errorThrown);
    //            console.log(jqXHR.responseText); // Log the response for more details
    //            $(".loader").hide();
    //        }
    //    });
    //}

});

$("#inventoryDD").change(function () {
    $(".loader").show();
    
    var locGUIDVal = $("#invPeriodwiseLocation").val();
    var inventoryDD = $("#inventoryDD").val();
    var inventoryPeriod = $("#invPeriodSelect").val();
    
    if (locGUIDVal == '0') {
        locGUIDVal = '';
    }
    if (inventoryDD == '0') {
        inventoryDD = '';
    }
    if (inventoryPeriod == '0') {
        inventoryPeriod = '';
    }
    
    loadGridAjax(locGUIDVal, inventoryDD, inventoryPeriod)
    //if (locGUIDVal == '0' && inventoryDD == '0') {
    //$.ajax({
    //    url: $('#url_local').val() + "/api/Dashboard/GetBookStockDataAgainstWarehouseGUIDandInventoryPeriod",
    //    type: 'POST',
    //    contentType: 'application/json', // Set the content type based on your API requirements
    //    data: JSON.stringify({
    //        "warehouseGUID": locGUIDVal,
    //        "inventoryGUID": inventoryDD,
    //        "inventoryPeriod": inventoryPeriod
    //    }), // Adjust the payload format based on your API
    //    headers: {
    //        'Authorization': 'Bearer ' + yourToken
    //    },
    //    success: function (data) {
    //        // Handle the successful response
            
    //        Bindbody(data, 'data-table');
    //    },
    //    error: function (jqXHR, textStatus, errorThrown) {
    //        // Handle the error
    //        //console.log('AJAX Error: ' + textStatus, errorThrown);
    //        //console.log(jqXHR.responseText); // Log the response for more details
    //        Bindbody([], 'data-table');
    //        $(".loader").hide();
    //    }
    //});
    //$.ajax({
    //    url: $('#url_local').val() + "/api/Dashboard/GetBookStockDataAgainstWarehouseGUID",
    //    type: 'POST',
    //    contentType: 'application/json', // Set the content type based on your API requirements
    //    data: JSON.stringify({
    //        "warehouseGUID": locGUIDVal,
    //        "inventoryGUID": inventoryDD
    //    }), // Adjust the payload format based on your API
    //    headers: {
    //        'Authorization': 'Bearer ' + yourToken
    //    },
    //    success: function (data) {
    //        // Handle the successful response

    //        Bindbody(data, 'data-table');
    //    },
    //    error: function (jqXHR, textStatus, errorThrown) {
    //        // Handle the error
    //        //console.log('AJAX Error: ' + textStatus, errorThrown);
    //        //console.log(jqXHR.responseText); // Log the response for more details
    //        Bindbody([], 'data-table');
    //        $(".loader").hide();
    //    }
    //});
    //}
    //else {
    //    $.ajax({
    //        url: $('#url_local').val() + "/api/Dashboard/GetBookStockDataAgainstWarehouseGUID",
    //        type: 'POST',
    //        contentType: 'application/json', // Set the content type based on your API requirements
    //        data: JSON.stringify({
    //            "warehouseGUID": locGUIDVal
    //        }), // Adjust the payload format based on your API
    //        headers: {
    //            'Authorization': 'Bearer ' + yourToken
    //        },
    //        success: function (data) {
    //            // Handle the successful response

    //            Bindbody(data, 'data-table');
    //        },
    //        error: function (jqXHR, textStatus, errorThrown) {
    //            // Handle the error
    //            console.log('AJAX Error: ' + textStatus, errorThrown);
    //            console.log(jqXHR.responseText); // Log the response for more details
    //            $(".loader").hide();
    //        }
    //    });
    //}

});

var searchTimeout;

var searchTerm = "2"

function loadGridAjax(locGUIDVal, inventoryDD, inventoryPeriod) {
    
    $("#data-table").DataTable().destroy();
    $("#data-table tbody").empty(); 

    var table = $("#data-table").DataTable({
        "processing": false, // Disable the default "Processing" message
        "serverSide": true, // Enable server-side pagination
        "searching": false, // Disable default search behavior
        "order": [[0, "asc"]],
        "ajax": {
            url: $('#url_local').val() + "/api/Dashboard/GetBookStockDataAgainstWarehouseGUIDandInventoryPeriod",
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + yourToken
            },
            data: function (d) {
                debugger
                const orderColumnIndex = d.order[0]?.column;
                const orderDirection = d.order[0]?.dir; // Ascending or descending
                const orderColumnName = d.columns[orderColumnIndex]?.data; // Column name


                // Concatenate column name and order direction
                const sortColumn = `${orderColumnName} ${orderDirection}`;

                searchTermVal = $('#customSearch').val();
                // Send the search term after debounce delay
                return JSON.stringify({
                    pageSize: d.length,
                    pageIndex: d.start / d.length,
                    searchValue: d.search.value,
                    warehouseGUID: locGUIDVal,
                    inventoryGUID: inventoryDD,
                    searchTerm: searchTermVal,
                    sortColumn: sortColumn,
                    inventoryPeriod: inventoryPeriod
                });
            },
            dataSrc: function (json) {
                $(".loader").hide();
                return json.data;
            }
        },
        "columns": [
            { "data": "item_Code" },
            { "data": "bookStockInventory" },
            { "data": "inventoryName" },
            { "data": "unitCostPrice" }
        ],
        "dom": 'lBfrtip',        
        "lengthMenu": [10, 25, 50],
        "pageLength": 10
    });

    // Store the current search term with a debounced function
    $('#customSearch').on('input', function () {
        
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function () {
            $(".loader").show();
            table.ajax.reload();
        }, 1000); // 2 seconds delay
    });
}

//it is working absoutely fine
function Bindbody(json, tablename) {
    var tr;
    
    $("#" + tablename).DataTable().destroy();
    $("#" + tablename + ' tbody').empty();
    for (var i = 0; i < json.length; i++) {

        tr = $('<tr/>');
        tr.append("<td>" + json[i].item_Code + "</td>");
        tr.append("<td>" + json[i].bookStockInventory + "</td>");
        tr.append("<td>" + json[i].inventoryName + "</td>");
        tr.append("<td>" + json[i].unitCostPrice + "</td>");
        $("#" + tablename + ' tbody').append(tr);
    }
    $("#" + tablename).DataTable(
        {
            "dom": '<"row justify-content-between top-information"lf>rt<"row justify-content-between bottom-information"ip><"clear">'
        });

    $(".loader").hide();

};

//$("#invPeriodSelect").change(function () {
//    var selectedInvPeriod = $("#invPeriodSelect").val();

//    $.ajax({
//        url: $('#url_local').val() + "/api/Inventory/GetInventoriesByInventoryPeriod",
//        type: 'POST',
//        contentType: 'application/json', // Set the content type based on your API requirements
//        data: JSON.stringify({ "InvPeriodID": selectedInvPeriod }), // Adjust the payload format based on your API
//        headers: {
//            'Authorization': 'Bearer ' + yourToken
//        },
//        success: function (data) {
//            // Handle the successful response
//            ddInventoryHandler(data);
//        },
//        error: function (jqXHR, textStatus, errorThrown) {
//            // Handle the error
//            console.log('AJAX Error: ' + textStatus, errorThrown);
//            console.log(jqXHR.responseText); // Log the response for more details
//        }
//    });

//});

$("#invPeriodwiseLocation").change(function () {
    
    if ($("#invPeriodwiseLocation").val() == "") {

        $("#inventory" + name).empty();
        var s = '<option value="">' + "All" + '</option>';
        $("#inventory").html(s);
    }
    else {
        filldropdownInventory()
    }
})

function filldropdownInventory() {
    $.ajax({
        url: $('#url_local').val() + "/api/Inventory/GetAllInventoriesByWarehouseGUIDandInventoryPeriod",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({
            "warehouseGUID": $("#invPeriodwiseLocation").val(),
            "inventoryPeriodID": $("#invPeriodSelect").val()
        }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {

            console.log("-------------------")
            console.log(data)
            // Handle the successful response

            ddlHandlerInv(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }
    });
    //$.ajax({
    //    url: $('#url_local').val() + "/api/Inventory/GetAllInventoriesByWarehouseGUID",
    //    type: 'POST',
    //    contentType: 'application/json', // Set the content type based on your API requirements
    //    data: JSON.stringify({
    //        "warehouseGUID": $("#invPeriodwiseLocation").val()
    //    }), // Adjust the payload format based on your API
    //    headers: {
    //        'Authorization': 'Bearer ' + yourToken
    //    },
    //    success: function (data) {

    //        console.log("-------------------")
    //        console.log(data)
    //        // Handle the successful response

    //        ddlHandlerInv(data);
    //    },
    //    error: function (jqXHR, textStatus, errorThrown) {
    //        // Handle the error
    //        console.log('AJAX Error: ' + textStatus, errorThrown);
    //        console.log(jqXHR.responseText); // Log the response for more details
    //    }
    //});

};

function ddlHandlerInv(response) {
    fillddlsInv('inventoryDD', 'All', response)
};

function fillddlsInv(name, selecttext, data) {
    $("#" + name).empty();
    var s = '<option value="">' + selecttext + '</option>';
    $.each(data, function (index, item) {
        s += '<option value="' + item.guid + '">' + item.engName + '</option>';
    });
    $("#" + name).html(s);
};