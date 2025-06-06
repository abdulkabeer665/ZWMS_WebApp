var yourToken;
var loginName;
var searchTimeout;

$(window).on('load', function () {
    yourToken = localStorage.getItem('yourToken');
    loginName = localStorage.getItem('loginName');
    showLoader();
    filldropdownWarehouse()
    hideLoader();

    $('.datepicker').datepicker();
    $('.datepicker2').datepicker();
    $('#warehouse').select2({
        width: '100%',
        
        // other options...
    });
    $('#inventory').select2({
        width: '100%',
        
        // other options...
    });
    var today = new Date().toISOString().split('T')[0];
    $('#From').val(today);
    $('#To').val(today);
    document.getElementById('From').setAttribute('max', today);
    document.getElementById('To').setAttribute('max', today);
});
var frmtime = "00:00:00.000";
var endtime = "23:59:59.999";

$("#warehouse").change(function () {
    if ($("#warehouse").val() == "") {

        $("#inventory" + name).empty();
        var s = '<option value="">' + "All" + '</option>';
        $("#inventory").html(s);
    }
    else {
        filldropdownInventory()
    }
});

// Flag to track if data is already loaded
var isDataLoadedForTab1 = false;
var isDataLoadedForTab2 = false;

// Function to check if required parameters are not empty
function areParametersValid() {
    return $("#From").val() && $("#To").val() && $("#warehouse").val() && $("#inventory").val();
}

// When tab is switched, check if data is already loaded, and call API if needed
$('#myTab a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
    
    var targetTab = $(e.target).attr("id"); // Get the active tab ID

    // Check if the parameters are valid (not empty)
    if (!areParametersValid()) {
        /*console.log("Required parameters are missing or empty.");*/
        return; // If parameters are invalid, stop further execution
    }

    // Check if Tab 1 (Summed Up Scans) is active
    if (targetTab === 'tab1-tab') {
        if (!isDataLoadedForTab1) {
            // If no data loaded, call API for "Summed Up Scans"
            callApiForTab1();
        }
    }
    // Check if Tab 2 (Individual Scans) is active
    else if (targetTab === 'tab2-tab') {
        if (!isDataLoadedForTab2) {
            // If no data loaded, call API for "Individual Scans"
            callApiForTab2();
        }
    }
});

function callApiForTab1() {
    
    $("#tblAllItems").DataTable().destroy();
    $("#tblAllItems tbody").empty();

    showLoader();
    //$("#" + tableName).DataTable().destroy();
    //$("#" + tableName + " tbody").empty();

    var table = $("#tblAllItems").DataTable({
        "processing": false, // Disable the default "Processing" message
        "serverSide": true, // Enable server-side pagination
        "searching": false, // Disable default search behavior
        "order": [[1, "asc"]],
        "ajax": {
            url: $('#url_local').val() + "/api/Dashboard/GetAllItemsOrderByVariancePagination",
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + yourToken
            },
            data: function (d) {
                
                const orderColumnIndex = d.order[0]?.column;
                const orderDirection = d.order[0]?.dir; // Ascending or descending
                const orderColumnName = d.columns[orderColumnIndex]?.data; // Column name
                
                // Concatenate column name and order direction
                const sortColumn = `${orderColumnName} ${orderDirection}`;

                if (sortColumn != '') {
                    showLoader();
                }

                searchTermVal = $('#customSearch').val();

                // Send the search term after debounce delay
                return JSON.stringify({
                    pageSize: d.length,
                    pageIndex: (d.start / d.length) + 1,
                    searchValue: d.search.value,
                    sortColumn: sortColumn,
                    searchTerm: searchTermVal,
                    Flag: "Sum", // For Summed Up Scans
                    From: $("#From").val() + " " + frmtime,
                    To: $("#To").val() + " " + endtime,
                    locationGUID: $("#warehouse").val(),
                    inventoryGUID: $("#inventory").val(),
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
                filename: "Variance_Report_Sum" + "_" + getCurrentDateTime(),
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
                            //"UserID": createdBy,
                            //"Flag": $("#flag").val(),
                            "pageIndex": 1, // First page
                            "pageSize": dt.ajax.json().recordsTotal, // Fetch all records
                            "searchTerm": $('#customSearch').val(),
                            //"sortColumn": sortColumn
                            Flag: "Sum", // For Summed Up Scans
                            From: $("#From").val() + " " + frmtime,
                            To: $("#To").val() + " " + endtime,
                            locationGUID: $("#warehouse").val(),
                            inventoryGUID: $("#inventory").val(),
                            //"sortColumn": dt.order()[0][0] + " " + dt.order()[0][1]
                        }),
                        success: function (response) {

                            // Export all data to Excel
                            const allData = response.data;
                            exportToExcel(allData, getColumnsConfig(), "Variance_Report_Sum" + "_" + getCurrentDateTime());
                            hideLoader()
                        },
                        error: function (xhr, status, error) {
                            console.error("Error fetching data for export:", error);
                            hideLoader()

                        }
                    });
                }
            }
            //,
            //{
            //    extend: 'pdfHtml5',
            //    text: '<button class="btn btn-danger"><i class="fa-solid fa-file-pdf"  style="font-size: 25px;"></i></button>',
            //    titleAttr: 'Export to PDF',
            //    filename: "Master Data Export_PDF" + "_" + getCurrentDateTime(),
            //    //filename: $("#pageheading").text() + "_" + getCurrentDateTime(),
            //    orientation: 'landscape',
            //    customize: function (doc) {
            //        doc.pageSize = { width: 1500, height: 1000 };
            //    },
            //    action: function (e, dt, button, config) {
            //        showLoader()
            //        $.ajax({
            //            url: $('#url_local').val() + "/api/Import/GetImportMasterData", // Get the API endpoint URL
            //            type: 'POST',
            //            contentType: 'application/json',
            //            headers: {
            //                'Authorization': 'Bearer ' + token
            //            },
            //            data: JSON.stringify({
            //                "UserID": createdBy,
            //                "Flag": $("#flag").val(),
            //                "pageIndex": 1,
            //                "pageSize": dt.ajax.json().recordsTotal,
            //                "searchTerm": $('#customSearch').val(),
            //                "sortColumn": dt.order()[0][0] + " " + dt.order()[0][1]
            //            }),
            //            success: function (response) {
            //                // Export all data to PDF
            //                const allData = response.data;
            //                console.log(allData);

            //                exportToPDF(allData, getColumnsConfig(), "Master Data Export_PDF" + "_" + getCurrentDateTime());
            //                //exportToPDF(allData, getColumnsConfig(), $("#pageheading").text() + "_" + getCurrentDateTime());
            //                hideLoader()

            //            },
            //            error: function (xhr, status, error) {
            //                console.error("Error fetching data for export:", error);
            //                hideLoader()

            //            }
            //        });
            //    }
            //}
        ],
        "lengthMenu": [10, 25, 50],
        "pageLength": 10
    });

    // Store the current search term with a debounced function
    $('#customSearch').on('input', function () {

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

//function exportToExcel(data, columns, filename) {

//    const wb = XLSX.utils.book_new();
//    const wsData = [];
//    // Add header row
//    wsData.push(columns.map(col => col.header));

//    // Add data rows
//    data.forEach(row => {
//        wsData.push(columns.map(col => row[col.key] || ""));
//    });

//    const ws = XLSX.utils.aoa_to_sheet(wsData);
//    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

//    XLSX.writeFile(wb, `${filename}.xlsx`);
//};

function getColumnsConfig() {
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

function getColumnsConfig_Ind() {

    return [
        { header: "Location", key: "location" },
        { header: "ItemNo", key: "itemNo" },
        { header: "InventoryName", key: "inventoryName" },
        { header: "UPC", key: "upc" },
        { header: "Description", key: "description" },
        { header: "UnitPerCost", key: "unitPerCost" },
        { header: "InventoryDate", key: "inventoryDate" },
        { header: "UOMCode", key: "uomCode" },             
        { header: "PackSize", key: "packSize" },             
        { header: "SystemQty", key: "systemQty" },             
        { header: "PhysicalQty", key: "physicalQty" },             
        { header: "QtyVariance", key: "qtyVariance" },             
        { header: "SystemValue", key: "systemValue" },             
        { header: "ActualValue", key: "actualValue" },             
        { header: "ValueVariance", key: "valueVariance" },             
        { header: "Category", key: "category" },             
        { header: "ProductGroup", key: "productGroup" },             
        { header: "Division", key: "division" },             
        { header: "ScannedBy", key: "scannedBy" },             
        { header: "Device", key: "device" },             
    ];
}

function callApiForTab2() {

    
    $("#tblAllItems2").DataTable().destroy();
    $("#tblAllItems2 tbody").empty();

    showLoader();
    //$("#" + tableName).DataTable().destroy();
    //$("#" + tableName + " tbody").empty();

    var table = $("#tblAllItems2").DataTable({
        "processing": false, // Disable the default "Processing" message
        "serverSide": true, // Enable server-side pagination
        "searching": false, // Disable default search behavior
        "order": [[0, "asc"]],
        "ajax": {
            url: $('#url_local').val() + "/api/Dashboard/GetAllItemsOrderByVariancePagination",
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + yourToken
            },
            data: function (d) {

                const orderColumnIndex = d.order[0]?.column;
                const orderDirection = d.order[0]?.dir; // Ascending or descending
                const orderColumnName = d.columns[orderColumnIndex]?.data; // Column name
                
                // Concatenate column name and order direction
                const sortColumn = `${orderColumnName} ${orderDirection}`;

                if (sortColumn != '') {
                    showLoader();
                }

                searchTermVal = $('#customSearch2').val();

                // Send the search term after debounce delay
                return JSON.stringify({
                    pageSize: d.length,
                    pageIndex: (d.start / d.length) + 1,
                    searchValue: d.search.value,
                    sortColumn: sortColumn,
                    searchTerm: searchTermVal,
                    Flag: "Ind", // For Summed Up Scans
                    From: $("#From").val() + " " + frmtime,
                    To: $("#To").val() + " " + endtime,
                    locationGUID: $("#warehouse").val(),
                    inventoryGUID: $("#inventory").val(),
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
            { "data": "upc" },
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
            { "data": "inventoryDate" },
            { "data": "uomCode" },
            { "data": "packSize" },
            { "data": "division" },
            { "data": "scannedBy" },
            { "data": "device" }
        ],
        "dom": 'lBfrtip',
        "buttons": [
            {
                extend: 'excelHtml5',
                text: '<button class="btn btn-success"><i class="fa-solid fa-file-excel" style="font-size: 25px;"></i></button>',
                titleAttr: 'Export to Excel',
                filename: "Variance_Report_Ind" + "_" + getCurrentDateTime(),
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
                            //"UserID": createdBy,
                            //"Flag": $("#flag").val(),
                            "pageIndex": 1, // First page
                            "pageSize": dt.ajax.json().recordsTotal, // Fetch all records
                            "searchTerm": $('#customSearch2').val(),
                            //"sortColumn": sortColumn
                            Flag: "Ind", // For Summed Up Scans
                            From: $("#From").val() + " " + frmtime,
                            To: $("#To").val() + " " + endtime,
                            locationGUID: $("#warehouse").val(),
                            inventoryGUID: $("#inventory").val(),
                        }),
                        success: function (response) {

                            // Export all data to Excel
                            const allData = response.data;
                            exportToExcel(allData, getColumnsConfig_Ind(), "Variance_Report_Ind" + "_" + getCurrentDateTime());
                            hideLoader()
                        },
                        error: function (xhr, status, error) {
                            console.error("Error fetching data for export:", error);
                            hideLoader()

                        }
                    });
                }
            }
            //,
            //{
            //    extend: 'pdfHtml5',
            //    text: '<button class="btn btn-danger"><i class="fa-solid fa-file-pdf"  style="font-size: 25px;"></i></button>',
            //    titleAttr: 'Export to PDF',
            //    filename: "Master Data Export_PDF" + "_" + getCurrentDateTime(),
            //    //filename: $("#pageheading").text() + "_" + getCurrentDateTime(),
            //    orientation: 'landscape',
            //    customize: function (doc) {
            //        doc.pageSize = { width: 1500, height: 1000 };
            //    },
            //    action: function (e, dt, button, config) {
            //        showLoader()
            //        $.ajax({
            //            url: $('#url_local').val() + "/api/Import/GetImportMasterData", // Get the API endpoint URL
            //            type: 'POST',
            //            contentType: 'application/json',
            //            headers: {
            //                'Authorization': 'Bearer ' + token
            //            },
            //            data: JSON.stringify({
            //                "UserID": createdBy,
            //                "Flag": $("#flag").val(),
            //                "pageIndex": 1,
            //                "pageSize": dt.ajax.json().recordsTotal,
            //                "searchTerm": $('#customSearch').val(),
            //                "sortColumn": dt.order()[0][0] + " " + dt.order()[0][1]
            //            }),
            //            success: function (response) {
            //                // Export all data to PDF
            //                const allData = response.data;
            //                console.log(allData);

            //                exportToPDF(allData, getColumnsConfig(), "Master Data Export_PDF" + "_" + getCurrentDateTime());
            //                //exportToPDF(allData, getColumnsConfig(), $("#pageheading").text() + "_" + getCurrentDateTime());
            //                hideLoader()

            //            },
            //            error: function (xhr, status, error) {
            //                console.error("Error fetching data for export:", error);
            //                hideLoader()

            //            }
            //        });
            //    }
            //}
        ],
        "lengthMenu": [10, 25, 50],
        "pageLength": 10
    });

    // Store the current search term with a debounced function
    $('#customSearch2').on('input', function () {
        
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function () {
            
            showLoader();
            //console.log("Search triggered after 2 seconds delay.");
            table.ajax.reload();
        }, 1000); // 2 seconds delay
    });
}

//It is working fine
//function callApiForTab1() {
//    /* alert("tab 1")*/
//    showLoader();
//    $.ajax({
//        url: $('#url_local').val() + "/api/Dashboard/GetAllItemsOrderByVariance",
//        type: 'POST',
//        contentType: 'application/json', // Set the content type based on your API requirements
//        data: JSON.stringify({
//            "Flag": "Sum", // For Summed Up Scans
//            "From": $("#From").val() + " " + frmtime,
//            "To": $("#To").val() + " " + endtime,
//            "locationGUID": $("#warehouse").val(),
//            "inventoryGUID": $("#inventory").val(),
//        }),
//        headers: {
//            'Authorization': 'Bearer ' + yourToken
//        },
//        success: function (data) {
//            // Handle the successful response
//            Bindbody(data, 'tblAllItems');
//            isDataLoadedForTab1 = true;
//            hideLoader();
//        },
//        error: function (jqXHR, textStatus, errorThrown) {
//            // Handle the error
//            console.log('AJAX Error: ' + textStatus, errorThrown);
//            console.log(jqXHR.responseText); // Log the response for more details
//        }
//    });
//}


//function callApiForTab2() {
   
//    showLoader();
//    $.ajax({
//        url: $('#url_local').val() + "/api/Dashboard/GetAllItemsOrderByVariance",
//        type: 'POST',
//        contentType: 'application/json', // Set the content type based on your API requirements
//        data: JSON.stringify({
//            "Flag": "Ind", // For Individual Scans
//            "From": $("#From").val() + " " + frmtime,
//            "To": $("#To").val() + " " + endtime,
//            "locationGUID": $("#warehouse").val(),
//            "inventoryGUID": $("#inventory").val(),
//        }),
//        headers: {
//            'Authorization': 'Bearer ' + yourToken
//        },
//        success: function (data) {
            
//            // Handle the successful response
//            Bindbody2(data, 'tblAllItems2');
//            isDataLoadedForTab2 = true;
//            hideLoader();
//        },
//        error: function (jqXHR, textStatus, errorThrown) {
//            // Handle the error
//            console.log('AJAX Error: ' + textStatus, errorThrown);
//            console.log(jqXHR.responseText); // Log the response for more details
//        }
//    });
//};

// Button click behavior: Clear grids and call the API
$('#btngen').click(function () {
    
    showLoader();

    // Clear both grids first
    $('#tblAllItems tbody').empty();
    $('#tblAllItems2 tbody').empty();

    // Reset the flags for data loaded
    isDataLoadedForTab1 = false;
    isDataLoadedForTab2 = false;

    // Now call the API based on which tab is active
    if ($('#tab2-tab').hasClass('active')) {
        // Tab 2 (Individual Scans) is active
        callApiForTab2();
    } else {
        // Tab 1 (Summed Up Scans) is active
        callApiForTab1();
    }

    /*hideLoader();*/
});

function Bindbody(json, tablename) {
  
    var tr;
    // Define column name to index mapping
    var columnMapping = {
        "location": 0,
        "inventoryName": 13,
        "itemNo": 2,
        "description": 3,
        "systemQty": 4,
        "physicalQty": 5,
        "qtyVariance": 6,
        "systemValue": 7,
        "actualValue": 8,
        "valueVariance": 9,
        "unitPerCost": 10,
        "category": 1,
        "productGroup": 12,
        //"inventorydate": 12,
        //"uomCode": 13,
        //"packsize": 14,
        "division": 13
       
    };

    $("#" + tablename).DataTable().destroy();
    $("#" + tablename + ' tbody').empty();
    for (var i = 0; i < json.length; i++) {
        tr = $('<tr/>');
        tr.append("<td>" + json[i].location + "</td>");
        tr.append("<td>" + json[i].inventoryName + "</td>");
        tr.append("<td>" + json[i].itemNo + "</td>");
        tr.append("<td>" + json[i].description + "</td>");
        tr.append("<td>" + json[i].systemQty + "</td>");
        tr.append("<td>" + json[i].physicalQty + "</td>");
        var qtyDifference = parseFloat(json[i].physicalQty) - parseFloat(json[i].systemQty);
        tr.append("<td>" + qtyDifference.toFixed(2) + "</td>");
        tr.append("<td>" + json[i].systemValue + "</td>");
        tr.append("<td>" + json[i].actualValue + "</td>");

        // Subtract systemValue from actualValue, then format the result
        var valueDifference = parseFloat(json[i].actualValue) - parseFloat(json[i].systemValue);
        tr.append("<td>" + valueDifference.toFixed(2) + "</td>");
        //tr.append("<td>" + parseFloat(json[i].valueVariance).toFixed(2) + "</td>");
        tr.append("<td>" + json[i].unitPerCost + "</td>");
        tr.append("<td>" + json[i].category + "</td>");
        tr.append("<td>" + json[i].productGroup + "</td>");
        //tr.append("<td>" + json[i].inventoryDate.split('T')[0] + "</td>");
        //tr.append("<td>" + json[i].uomCode+ "</td>");
        //tr.append("<td>" + json[i].packSize+ "</td>");

        tr.append("<td>" + json[i].division + "</td>");
      
        $("#" + tablename + ' tbody').append(tr);
    };

    var orderColumn = columnMapping["valueVariance"]; // Use the column name to get the index

    $("#" + tablename).DataTable({
        "order": [[orderColumn, 'asc']], // Order by the calculated column index. For no order use "order": [],
        "dom": '<"row justify-content-between top-information"lf>rt<"row justify-content-between bottom-information"ip><"clear">',
        dom: 'Bfrtip', // Include the buttons extension
        buttons: [
            {
                text: 'Export Data',
                action: function (e, dt, button, config) {
                    
//aasdasd
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
                        
                        var csvFileName = "Variance_Report_Sum.csv";

                        // Create a Blob for CSV (comma-separated values) content
                        var csvBlob = new Blob([csvContent], { type: 'text/csv' });

                        saveAs(csvBlob, csvFileName);

                    } else {
                        alert("No records to export, please select the correct warehouse.");
                        return;
                    }

                }
            }
        ]
    });
};

function Bindbody2(json, tablename) {
   
    var tr;
    // Define column name to index mapping
    var columnMapping = {
        "itemNo": 0,
        "inventoryName": 1,
        "description": 2,
        "upc":            3,
        "systemQty":     4,
        "physicalQty":   5,
        "qtyVariance":      6,
        "systemValue":    7,
        "actualValue":   8,
        "valueVariance": 9,
        "unitPerCost":   10,
        "category":      11,
        "productGroup":  12,
        "inventorydate":    13,
        "uomCode":      14,
        "packsize":     
                        15,
        "location":     16,
        "division":      17,
        "scannedBy":     18,
        "device": 19      
        

    };

    $("#" + tablename).DataTable().destroy();
    $("#" + tablename + ' tbody').empty();
    for (var i = 0; i < json.length; i++) {
        tr = $('<tr/>');
        tr.append("<td>" + json[i].location + "</td>");
        tr.append("<td>" + json[i].inventoryName + "</td>");
        tr.append("<td>" + json[i].itemNo + "</td>");
        tr.append("<td>" + json[i].upc + "</td>");
        tr.append("<td>" + json[i].description + "</td>");
        tr.append("<td>" + json[i].systemQty + "</td>");
        tr.append("<td>" + json[i].physicalQty + "</td>");
        tr.append("<td>" + parseFloat(json[i].qtyVariance).toFixed(2) + "</td>");
        tr.append("<td>" + json[i].systemValue + "</td>");
        tr.append("<td>" + json[i].actualValue + "</td>");
        tr.append("<td>" + parseFloat(json[i].valueVariance).toFixed(2) + "</td>");
        tr.append("<td>" + json[i].unitPerCost + "</td>");
        tr.append("<td>" + json[i].category + "</td>");
        tr.append("<td>" + json[i].productGroup + "</td>");
        tr.append("<td>" + json[i].inventoryDate.split('T')[0] + "</td>");
        tr.append("<td>" + json[i].uomCode + "</td>");
        tr.append("<td>" + json[i].packSize + "</td>");
       
        tr.append("<td>" + json[i].division + "</td>");
        tr.append("<td>" + json[i].scannedBy + "</td>");
        tr.append("<td>" + json[i].device + "</td>");
      
        $("#" + tablename + ' tbody').append(tr);
    };
    var orderColumn = columnMapping["valueVariance"]; // Use the column name to get the index
    $("#" + tablename).DataTable({
        "order": [[orderColumn, 'asc']], // Order by the calculated column index. For no order use "order": [],
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
                        
                        var csvFileName = "Variance_Report_Indivisual.csv";

                        // Create a Blob for CSV (comma-separated values) content
                        var csvBlob = new Blob([csvContent], { type: 'text/csv' });

                        saveAs(csvBlob, csvFileName);

                    }
                    else {
                        alert("No records to export, please select the correct warehouse.");
                        return;
                    }
                }
            }
        ]
    });
};

function filldropdownWarehouse() {
   
    $.ajax({
        url: $('#url_local').val() + "/api/Warehouse/GetAllWarehouses",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({ "GET": 1 }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {

            ddlHandler(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }
    });

};

function ddlHandler(response) {
    fillddls('warehouse', 'All', response)
};

function fillddls(name, selecttext, data) {
    $("#" + name).empty();
    var s = '<option value="">' + selecttext + '</option>';

    $.each(data, function (index, item) {
        s += '<option value="' + item.guid + '">' + item.warehouseEngName + '</option>';
       
    });
    $("#" + name).html(s);
};

function filldropdownInventory() {
  
    $.ajax({
        url: $('#url_local').val() + "/api/Inventory/GetAllInventoriesByWarehouseGUID",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({ "warehouseGUID": $("#warehouse").val() }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {

            ddlHandlerInv(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }
    });
   
};

function ddlHandlerInv(response) {
    fillddlsInv('inventory', 'All', response)
};

function fillddlsInv(name, selecttext, data) {
    $("#" + name).empty();
    var s = '<option value="">' + selecttext + '</option>';
    $.each(data, function (index, item) {
        s += '<option value="' + item.guid + '">' + item.engName + '</option>';
    });
    $("#" + name).html(s);
};

function showLoader() {

    document.querySelector('.loader-container').style.display = 'block';
};

function hideLoader() {
    document.querySelector('.loader-container').style.display = 'none';
};