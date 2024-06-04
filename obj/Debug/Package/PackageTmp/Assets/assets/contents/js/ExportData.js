var yourToken;
var loginName;

$(window).on('load', function () {

    $('.loader').show();
    yourToken = sessionStorage.getItem('yourToken');
    loginName = sessionStorage.getItem('loginName');
    loadDevicesDD();
    loadInventoriesDD();
    $('.loader').hide();

    var table = $('#tblExportData').DataTable();

});

function Bindbody(json, tablename) {
    var tr;
    $("#" + tablename).DataTable().destroy();
    $("#" + tablename + ' tbody').empty();
    for (var i = 0; i < json.length; i++) {
        tr = $('<tr/>');
        tr.append("<td>" + json[i].store + "</td>");
        tr.append("<td>" + json[i].itemNo + "</td>");
        tr.append("<td>" + json[i].itemDesc + "</td>");
        tr.append("<td>" + json[i].productGroup + "</td>");
        tr.append("<td>" + (json[i].bin != null ? json[i].bin : "") + "</td>");
        tr.append("<td>" + json[i].packageType + "</td>");
        tr.append("<td>" + json[i].packSize + "</td>");
        tr.append("<td>" + json[i].qtyPerUOM + "</td>");
        tr.append("<td>" + json[i].upc + "</td>");
        tr.append("<td>" + parseFloat(json[i].retailPrice).toFixed(2) + "</td>");
        tr.append("<td>" + parseFloat(json[i].costPrice).toFixed(2) + "</td>");
        tr.append("<td>" + json[i].bookStock + "</td>");
        tr.append("<td>" + json[i].phystock + "</td>");
        tr.append("<td>" + json[i].datetime + "</td>");
        tr.append("<td>" + (json[i].bincode != null ? json[i].bincode : "") + "</td>");
        tr.append("<td>" + (json[i].lotExpiry != null && json[i].lotExpiry !== "" ? json[i].lotExpiry : "") + "</td>");

        tr.append("<td>" + json[i].deviceCode + "</td>");
        $("#" + tablename + ' tbody').append(tr);
    };

    $("#" + tablename).DataTable({
        "dom": '<"row justify-content-between top-information"lf>rt<"row justify-content-between bottom-information"ip><"clear">',
        dom: 'Bfrtip', // Include the buttons extension
        buttons: [
            {
                text: 'Export Data',
                action: function (e, dt, button, config) {

                    var data = dt.buttons.exportData();
                    var tsv = '';

                    var dataLength = data.body.length;

                    if (dataLength > 0) {
                        // Add data rows (excluding the header row)
                        for (var i = 0; i < dataLength; i++) {
                            tsv += data.body[i].join('\t') + '\n';
                        }
                    }
                    else {
                        alert("No records to export, please select the correct warehouse.");
                        return;
                    }
                    debugger
                    var inv = $("#inventoriesDD").val();
                    var invName = $("#inventoriesDD option:selected").text();
                    var dev = $("#devicesDD").val();
                    var devName = $("#devicesDD option:selected").text();

                    $.ajax({
                        url: $('#url_local').val() + "/api/Export/GetSerialNoForExportData",
                        type: 'POST',
                        contentType: 'application/json', // Set the content type based on your API requirements
                        data: JSON.stringify({
                            "inventoryGUID": inv,
                            "deviceID": dev
                        }), // Adjust the payload format based on your API
                        headers: {
                            'Authorization': 'Bearer ' + yourToken
                        },
                        success: function (data) {
                            var res = getSerialNo(data);
                            var fileName;
                            res = res + 1;

                            if (dev == "0") {
                                filename = "_" + invName + "_" + res + ".txt";
                            }
                            else {
                                filename = devName + "_" + invName + "_" + res + ".txt";
                            }
                            // Prompt user for filename
                            // Save as TSV file
                            var blob = new Blob([tsv], { type: 'text/tab-separated-values' });
                            saveAs(blob, filename);

                            swal({
                                title: "Export Completed, Exported Items Count = " + dataLength + ".",
                                icon: "success",
                                button: "OK",
                            }).then((Save) => {
                                if (Save) {
                                    genericFunction(inv, dev)
                                }
                            });
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            // Handle the error
                            console.log('AJAX Error: ' + textStatus, errorThrown);
                            console.log(jqXHR.responseText); // Log the response for more details
                        }
                    });

                    
                }
            }
        ]
    });

};

function loadInventoriesDD() {
    $.ajax({
        url: $('#url_local').val() + "/api/Export/GetAllInventories",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({
            "get": 1,
            "web": 1
        }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            fillDDs('inventoriesDD', 'Select Inventory', data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }
    });
};

function loadDevicesDD() {
    $.ajax({
        url: $('#url_local').val() + "/api/Export/GetAllDevices",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({
            "get": 1
        }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            fillDDs('devicesDD', 'Select Device', data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }
    });
};

function fillDDs(elementID, firstElement, response) {
    $("#" + elementID).empty();
    var s = '<option value="0">' + firstElement + '</option>';
    $.each(response, function (index, item) {
        s += '<option value="' + item.guid + '">' + item.engName + '</option>';
    });
    $("#" + elementID).html(s);
};

$("#inventoriesDD").change(function () {
    var inv = $("#inventoriesDD").val();
    var dev = $("#devicesDD").val();
    debugger
    genericFunction(inv, dev);
});

function genericFunction(inv, dev) {
    $.ajax({
        url: $('#url_local').val() + "/api/Export/ExportDataAgainstInvOrDeviceID",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({
            "inventoryGUID": inv,
            "deviceID": dev
        }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            Bindbody(data, 'tblExportData')
            $('.loader').hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }
    });
}

function getSerialNo(data) {
    var abc = data[0]["fileSerialNumber"];
    return abc;
};

$("#devicesDD").change(function () {
    debugger
    var inv = $("#inventoriesDD").val();
    var dev = $("#devicesDD").val();
    var invName = $("#inventoriesDD option:selected").text();

    if (invName == "Select Inventory") {
        return;
    }
    else {
        genericFunction(inv, dev)
    }
});