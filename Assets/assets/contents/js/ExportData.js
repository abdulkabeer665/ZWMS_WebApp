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

        tr.append("<td>" + json[i].deviceName + "</td>");
        tr.append("<td>" + json[i].userName + "</td>");
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
                    var csvContent = '';

                    var dataLength = data.body.length;

                    if (dataLength > 0) {
                        // Add header row only for CSV
                        var header = data.header.join('\t') + '\n';
                        csvContent += header.replace(/\t/g, ","); // Convert header to CSV format

                        // Add data rows
                        for (var i = 0; i < dataLength; i++) {
                            var row = data.body[i].join('\t') + '\n';
                            tsv += row; // No header for TSV
                            csvContent += row.replace(/\t/g, ","); // Convert row to CSV format
                        }
                    } else {
                        alert("No records to export, please select the correct warehouse.");
                        return;
                    }

                    var inv = $("#inventoriesDD").val();
                    var invName = $("#inventoriesDD option:selected").text();
                    var dev = $("#devicesDD").val();
                    var devName = $("#devicesDD option:selected").text();

                    $.ajax({
                        url: $('#url_local').val() + "/api/Export/GetSerialNoForExportData",
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            "inventoryGUID": inv,
                            "deviceID": dev,
                            "flag": "Sum"
                        }),
                        headers: {
                            'Authorization': 'Bearer ' + yourToken
                        },
                        success: function (data) {
                            var res = getSerialNo(data);
                            var txtFileName, csvFileName;
                            res = res + 1;
                            
                            if (dev == "0") {
                                txtFileName = "_" + invName + "_" + res + ".txt";
                                csvFileName = "_" + invName + "_" + res + ".csv";
                            } else {
                                txtFileName = devName + "_" + invName + "_" + res + ".txt";
                                csvFileName = devName + "_" + invName + "_" + res + ".csv";
                            }

                            // Create a Blob for TSV (tab-separated values) content
                            var tsvBlob = new Blob([tsv], { type: 'text/tab-separated-values' });

                            // Create a Blob for CSV (comma-separated values) content
                            var csvBlob = new Blob([csvContent], { type: 'text/csv' });

                            swal({
                                title: "Choose File Format",
                                icon: "info",
                                buttons: {
                                    txt: {
                                        text: "Download as .txt",
                                        value: "txt",
                                    },
                                    csv: {
                                        text: "Download as .csv",
                                        value: "csv",
                                    },
                                    cancel: "Cancel"
                                },
                            }).then((value) => {
                                if (value === "txt") {
                                    saveAs(tsvBlob, txtFileName);
                                } else if (value === "csv") {

                                    saveAs(csvBlob, csvFileName);
                                }

                                if (value) {
                                    swal({
                                        title: "Export Completed",
                                        text: "Exported Items Count = " + dataLength + ".",
                                        icon: "success",
                                        button: "OK",
                                    }).then((Save) => {
                                        if (Save) {
                                            genericFunction(inv, dev,"Ind");
                                        }
                                    });
                                }
                            });
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            // Handle the error
                            console.log('AJAX Error: ' + textStatus, errorThrown);
                            console.log(jqXHR.responseText); // Log the response for more details
                        }
                        //success: function (data) {
                        //    var res = getSerialNo(data);
                        //    var fileName;
                        //    res = res + 1;

                        //    if (dev == "0") {
                        //        filename = "_" + invName + "_" + res + ".txt";
                        //    }
                        //    else {
                        //        filename = devName + "_" + invName + "_" + res + ".txt";
                        //    }
                        //    // Prompt user for filename
                        //    // Save as TSV file
                        //    var blob = new Blob([tsv], { type: 'text/tab-separated-values' });
                        //    saveAs(blob, filename);

                        //    swal({
                        //        title: "Export Completed, Exported Items Count = " + dataLength + ".",
                        //        icon: "success",
                        //        button: "OK",
                        //    }).then((Save) => {
                        //        if (Save) {
                        //            genericFunction(inv, dev)
                        //        }
                        //    });
                        //},
                        //error: function (jqXHR, textStatus, errorThrown) {
                        //    // Handle the error
                        //    console.log('AJAX Error: ' + textStatus, errorThrown);
                        //    console.log(jqXHR.responseText); // Log the response for more details
                        //}
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
    
    genericFunction(inv, dev,"Ind");
    genericFunction(inv, dev,"Sum");

   // summaryRecord()
});
//function summaryRecord() {
//    $.ajax({
//        url: $('#url_local').val() + "/api/Dashboard/GetAllItemsOrderByVariance",
//        type: 'POST',
//        contentType: 'application/json', // Set the content type based on your API requirements
//        data: JSON.stringify({
//            "Flag": "Sum"

//        }), // Adjust the payload format based on your API
//        //data: JSON.stringify({ /*"GET": 1*/ }), // Adjust the payload format based on your API
//        headers: {
//            'Authorization': 'Bearer ' + yourToken
//        },
//        success: function (data) {
//            // Handle the successful response
//            //FillGridHandler(data);
//            Bindbody2(data, 'tblAllItems')
//            $('.loader').hide();
//        },
//        error: function (jqXHR, textStatus, errorThrown) {
//            // Handle the error
//            console.log('AJAX Error: ' + textStatus, errorThrown);
//            console.log(jqXHR.responseText); // Log the response for more details
//        }
//    });

//}

function genericFunction(inv, dev, Flag) {
    
    
    if (Flag == "Ind") {
        $.ajax({
            url: $('#url_local').val() + "/api/Export/ExportDataAgainstInvOrDeviceID",
            type: 'POST',
            contentType: 'application/json', // Set the content type based on your API requirements
            data: JSON.stringify({
                "inventoryGUID": inv,
                "deviceID": dev,
                "Flag": "Ind"
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
    else {
    $.ajax({
        url: $('#url_local').val() + "/api/Export/ExportDataAgainstInvOrDeviceID",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({
            "inventoryGUID": inv,
            "deviceID": dev,
            "Flag": "Sum"
        }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            Bindbody2(data, 'tblExportDataSum')
            $('.loader').hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }
    });
    }
}

function getSerialNo(data) {
    var abc = data[0]["fileSerialNumber"];
    return abc;
};

$("#devicesDD").change(function () {
    
    var inv = $("#inventoriesDD").val();
    var dev = $("#devicesDD").val();
    var invName = $("#inventoriesDD option:selected").text();

    if (invName == "Select Inventory") {
        return;
    }
    else {
        genericFunction(inv, dev,"Ind")
        genericFunction(inv, dev,"Sum")
    }
});

$("#filterDD").change(function () {
    var inv = $("#inventoriesDD").val();
    var dev = $("#devicesDD").val();
    genericFunction(inv, dev);
});

function Bindbody2(json, tablename) {
    var tr;
    $("#" + tablename).DataTable().destroy();
    $("#" + tablename + ' tbody').empty();
    for (var i = 0; i < json.length; i++) {
        tr = $('<tr/>');
        tr.append("<td>" + json[i].store + "</td>");
        tr.append("<td>" + json[i].itemNo + "</td>");
        tr.append("<td>" + json[i].itemDesc + "</td>");
        tr.append("<td>" + json[i].productGroup + "</td>");
        //tr.append("<td>" + (json[i].bin != null ? json[i].bin : "") + "</td>");
        //tr.append("<td>" + json[i].packageType + "</td>");
        //tr.append("<td>" + json[i].packSize + "</td>");
        //tr.append("<td>" + json[i].qtyPerUOM + "</td>");
       // tr.append("<td>" + json[i].upc + "</td>");
        tr.append("<td>" + parseFloat(json[i].retailPrice).toFixed(2) + "</td>");
        tr.append("<td>" + parseFloat(json[i].costPrice).toFixed(2) + "</td>");
        //tr.append("<td>" + json[i].bookStock + "</td>");
        tr.append("<td>" + json[i].phystock + "</td>");
        tr.append("<td>" + json[i].datetime + "</td>");
        //tr.append("<td>" + (json[i].bincode != null ? json[i].bincode : "") + "</td>");
        //tr.append("<td>" + (json[i].lotExpiry != null && json[i].lotExpiry !== "" ? json[i].lotExpiry : "") + "</td>");

        //tr.append("<td>" + json[i].deviceName + "</td>");
        //tr.append("<td>" + json[i].userName + "</td>");

        $("#" + tablename + ' tbody').append(tr);
    };

    $("#" + tablename).DataTable({
        "dom": '<"row justify-content-between top-information"lf>rt<"row justify-content-between bottom-information"ip><"clear">',
        dom: 'Bfrtip', // Include the buttons extension
        dom: 'Bfrtip', // Include the buttons extension
        buttons: [
            {
                text: 'Export Data',
                action: function (e, dt, button, config) {
                    
                    var data = dt.buttons.exportData();
                    var tsv = '';
                    var csvContent = '';

                    var dataLength = data.body.length;

                    if (dataLength > 0) {
                        // Add header row only for CSV
                        var header = data.header.join('\t') + '\n';
                        csvContent += header.replace(/\t/g, ","); // Convert header to CSV format

                        // Add data rows
                        for (var i = 0; i < dataLength; i++) {
                            var row = data.body[i].join('\t') + '\n';
                            tsv += row; // No header for TSV
                            csvContent += row.replace(/\t/g, ","); // Convert row to CSV format
                        }
                    } else {
                        alert("No records to export, please select the correct warehouse.");
                        return;
                    }
                    
                    var inv = $("#inventoriesDD").val();
                    var invName = $("#inventoriesDD option:selected").text();
                    var dev = $("#devicesDD").val();
                    var devName = $("#devicesDD option:selected").text();

                    $.ajax({
                        url: $('#url_local').val() + "/api/Export/GetSerialNoForExportData",
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            "inventoryGUID": inv,
                            "deviceID": dev,
                            "flag": "Sum"
                        }),
                        headers: {
                            'Authorization': 'Bearer ' + yourToken
                        },
                        success: function (data) {
                            
                            var res = getSerialNo(data);
                            var txtFileName, csvFileName;
                            res = res + 1;

                            if (dev == "0") {
                                txtFileName = "_" + invName + "_" + res + ".txt";
                                csvFileName = "_" + invName + "_" + res + ".csv";
                            } else {
                                txtFileName = devName + "_" + invName + "_" + res + ".txt";
                                csvFileName = devName + "_" + invName + "_" + res + ".csv";
                            }

                            // Create a Blob for TSV (tab-separated values) content
                            var tsvBlob = new Blob([tsv], { type: 'text/tab-separated-values' });

                            // Create a Blob for CSV (comma-separated values) content
                            var csvBlob = new Blob([csvContent], { type: 'text/csv' });

                            swal({
                                title: "Choose File Format",
                                icon: "info",
                                buttons: {
                                    txt: {
                                        text: "Download as .txt",
                                        value: "txt",
                                    },
                                    csv: {
                                        text: "Download as .csv",
                                        value: "csv",
                                    },
                                    cancel: "Cancel"
                                },
                            }).then((value) => {
                                if (value === "txt") {
                                    saveAs(tsvBlob, txtFileName);
                                } else if (value === "csv") {
                                    
                                    saveAs(csvBlob, csvFileName);
                                }

                                if (value) {
                                    swal({
                                        title: "Export Completed",
                                        text: "Exported Items Count = " + dataLength + ".",
                                        icon: "success",
                                        button: "OK",
                                    }).then((Save) => {
                                        if (Save) {
                                            genericFunction(inv, dev, "Sum");
                                        }
                                    });
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