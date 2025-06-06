var yourToken;
var loginName;
var searchTimeout;

$(window).on('load', function () {

    $('.loader').show();
    yourToken = localStorage.getItem('yourToken');
    loginName = localStorage.getItem('loginName');
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
    
    //genericFunction(inv, dev,"Ind");
    callApiForTab1(inv, dev, "Ind", "tblExportData")
    //callApiForTab1(inv, dev,"Sum");

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

function callApiForTab1(inv, dev, Flag, tableName) {
    debugger
    $("#" + tableName).DataTable().destroy();
    $("#" + tableName + " tbody").empty();

    showLoader();
    //$("#" + tableName).DataTable().destroy();
    //$("#" + tableName + " tbody").empty();

    var table = $("#" + tableName).DataTable({
        "processing": false, // Disable the default "Processing" message
        "serverSide": true, // Enable server-side pagination
        "searching": false, // Disable default search behavior
        "order": [[1, "asc"]],
        "ajax": {
            url: $('#url_local').val() + "/api/Export/ExportDataAgainstInvOrDeviceIDPagination",
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

                if (sortColumn != '') {
                    showLoader();
                }

                if (Flag = "Ind") {
                    searchTermVal = $('#customSearchInd').val();
                }
                else {
                    searchTermVal = $('#customSearchSum').val();
                }
                
                //"inventoryGUID": inv,
                //    "deviceID": dev,
                //        "Flag": "Ind"
                // Send the search term after debounce delay
                return JSON.stringify({
                    pageSize: d.length,
                    pageIndex: (d.start / d.length) + 1,
                    searchValue: d.search.value,
                    sortColumn: sortColumn,
                    searchTerm: searchTermVal,
                    Flag: Flag,
                    deviceID: dev,
                    inventoryGUID: inv,
                });
            },
            dataSrc: function (json) {
                hideLoader();
                return json.data;
            }
        },
        "columns": [

            { "data": "location" },
            { "data": "itemNo" },
            { "data": "inventoryName" },
            { "data": "description" },
            { "data": "systemQty" },
            { "data": "physicalQty" },
            { "data": "qtyVariance" },
            { "data": "systemValue" },
            { "data": "actualValue" },
            { "data": "valueVariance" },
            { "data": "unitPerCost" },
            { "data": "category" },
            { "data": "productGroup" },
            { "data": "division" },
        ],
        "dom": 'lBfrtip',
        "buttons": [
            {
                extend: 'excelHtml5',
                text: '<button class="btn btn-success"><i class="fa-solid fa-file-excel" style="font-size: 25px;"></i></button>',
                titleAttr: 'Export to Excel',
                filename: "Export_Report_" + Flag + "_" + getCurrentDateTime(),
                //filename: $("#pageheading").text() + "_" + getCurrentDateTime(),
                action: function (e, dt, button, config) {

                    const orderColumnIndex = dt.order[0]?.column;
                    const orderDirection = dt.order[0]?.dir; // Ascending or descending
                    const orderColumnName = dt.columns[orderColumnIndex]?.data; // Column name

                    // Concatenate column name and order direction
                    const sortColumn = `${orderColumnName} ${orderDirection}`;

                    showLoader()

                    $.ajax({
                        url: $('#url_local').val() + "/api/Dashboard/GetAllItemsOrderByVariancePagination",
                        type: 'POST',
                        contentType: 'application/json',
                        headers: {
                            'Authorization': 'Bearer ' + yourToken
                        },
                        data: JSON.stringify({
                            pageSize: d.length,
                            pageIndex: (d.start / d.length) + 1,
                            searchValue: d.search.value,
                            sortColumn: sortColumn,
                            searchTerm: searchTermVal,
                            Flag: Flag,
                            deviceID: dev,
                            inventoryGUID: inv,
                        }),
                        success: function (response) {

                            // Export all data to Excel
                            const allData = response.data;
                            exportToExcel(allData, getColumnsConfig(Flag), "Export_Report_" + Flag + "_" + getCurrentDateTime());
                            hideLoader()
                        },
                        error: function (xhr, status, error) {
                            console.error("Error fetching data for export:", error);
                            hideLoader()

                        }
                    });
                }
            }
        ],
        "lengthMenu": [10, 25, 50],
        "pageLength": 10
    });

    // Store the current search term with a debounced function
    $('#customSearchSum').on('input', function () {

        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function () {

            showLoader();
            //console.log("Search triggered after 2 seconds delay.");
            table.ajax.reload();
        }, 1000); // 2 seconds delay
    });

    $('#customSearchInd').on('input', function () {

        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function () {

            showLoader();
            //console.log("Search triggered after 2 seconds delay.");
            table.ajax.reload();
        }, 1000); // 2 seconds delay
    });
};

function getCurrentDateTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

function exportToExcel(data, columns, filename) {
    const wb = XLSX.utils.book_new();
    const wsData = [];

    // Add header row
    wsData.push(columns.map(col => col.header));

    // Add data rows
    data.forEach(row => {
        wsData.push(columns.map(col => {
            const value = row[col.key];

            // Keep 0, and format numbers to 2 decimals if needed
            if (typeof value === "number") {
                return value.toFixed(2);
            }

            return value !== undefined && value !== null ? value : "";
        }));
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Optional: explicitly set number format for all columns
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const columnLetter = XLSX.utils.encode_col(C);
        for (let R = 1; R <= range.e.r; ++R) {
            const cellAddress = `${columnLetter}${R + 1}`;
            const cell = ws[cellAddress];
            if (cell && !isNaN(cell.v)) {
                cell.z = '0.00'; // force 2 decimal places
            }
        }
    }

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${filename}.xlsx`);
}

function getColumnsConfig(Flag) {
    if (Flag == "Ind") {
        return [
            { header: "Location", key: "location" },
            { header: "ItemNo", key: "itemNo" },
            { header: "InventoryName", key: "inventoryName" },
            { header: "Description", key: "description" },
            { header: "SystemQty", key: "systemQty" },
            { header: "PhysicalQty", key: "physicalQty" },
            { header: "QtyVariance", key: "qtyVariance" },
            { header: "SystemValue", key: "systemValue" },
            { header: "ActualValue", key: "actualValue" },
            { header: "ValueVariance", key: "valueVariance" },
            { header: "UnitPerCost", key: "unitPerCost" },
            { header: "Category", key: "category" },
            { header: "ProductGroup", key: "productGroup" },
            { header: "Division", key: "division" },
        ];
    }
    else {
        return [
            { header: "Location", key: "location" },
            { header: "ItemNo", key: "itemNo" },
            { header: "InventoryName", key: "inventoryName" },
            { header: "Description", key: "description" },
            { header: "SystemQty", key: "systemQty" },
            { header: "PhysicalQty", key: "physicalQty" },
            { header: "QtyVariance", key: "qtyVariance" },
            { header: "SystemValue", key: "systemValue" },
            { header: "ActualValue", key: "actualValue" },
            { header: "ValueVariance", key: "valueVariance" },
            { header: "UnitPerCost", key: "unitPerCost" },
            { header: "Category", key: "category" },
            { header: "ProductGroup", key: "productGroup" },
            { header: "Division", key: "division" },
        ];
    }
    
}

function showLoader() {
    debugger
    document.querySelector('.loader-container').style.display = 'block';
};

function hideLoader() {
    document.querySelector('.loader-container').style.display = 'none';
};