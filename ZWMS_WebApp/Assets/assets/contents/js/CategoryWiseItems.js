var yourToken;
var loginName;
var searchTimeout;

$(window).on('load', function () {
    debugger
    yourToken = localStorage.getItem('yourToken');
    loginName = localStorage.getItem('loginName');
    showLoader();
    
    //loadGridAjax();
    loadGrid();
});

function loadGrid() {
    debugger
    $("#tblAllItems").DataTable().destroy();
    $("#tblAllItems tbody").empty();

    showLoader();
    //$("#" + tableName).DataTable().destroy();
    //$("#" + tableName + " tbody").empty();

    var table = $("#tblAllItems").DataTable({
        "processing": false, // Disable the default "Processing" message
        "serverSide": true, // Enable server-side pagination
        "searching": false, // Disable default search behavior
        "order": [[0, "asc"]],
        "ajax": {
            url: $('#url_local').val() + "/api/Dashboard/GetAllItemsCategoryWiseOrderByVariancePagination",
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

                searchTermVal = $('#customSearchCategoryWise').val();

                // Send the search term after debounce delay
                return JSON.stringify({
                    pageSize: d.length,
                    pageIndex: (d.start / d.length) + 1,
                    searchValue: d.search.value,
                    sortColumn: sortColumn,
                    searchTerm: searchTermVal,
                    //Flag: "Sum", // For Summed Up Scans
                    //From: $("#From").val() + " " + frmtime,
                    //To: $("#To").val() + " " + endtime,
                    //locationGUID: $("#warehouse").val(),
                    //inventoryGUID: $("#inventory").val(),
                });
            },
            dataSrc: function (json) {
                hideLoader();
                
                return json.data;
            }
        },
        
        "columns": [
            { "data": "location" },
            { "data": "category" },
            { "data": "systemData" },
            { "data": "physicalData" },
            { "data": "varianceData" },
        ],
        "dom": 'lBfrtip',
        "buttons": [
            {
                extend: 'excelHtml5',
                text: '<button class="btn btn-success"><i class="fa-solid fa-file-excel" style="font-size: 25px;"></i></button>',
                titleAttr: 'Export to Excel',
                filename: "Category_Wise_Report" + "_" + getCurrentDateTime(),
                //filename: $("#pageheading").text() + "_" + getCurrentDateTime(),
                action: function (e, dt, button, config) {

                    const orderColumnIndex = dt.order[0]?.column;
                    const orderDirection = dt.order[0]?.dir; // Ascending or descending
                    const orderColumnName = dt.columns[orderColumnIndex]?.data; // Column name


                    // Concatenate column name and order direction
                    const sortColumn = `${orderColumnName} ${orderDirection}`;

                    showLoader();

                    $.ajax({
                        url: $('#url_local').val() + "/api/Dashboard/GetAllItemsCategoryWiseOrderByVariancePagination",
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
                            "searchTerm": $('#customSearchCategoryWise').val(),
                            //"sortColumn": sortColumn
                            //"sortColumn": dt.order()[0][0] + " " + dt.order()[0][1]
                        }),
                        success: function (response) {

                            // Export all data to Excel
                            const allData = response.data;
                            exportToExcel(allData, getColumnsConfig(), "Category_Wise_Report" + "_" + getCurrentDateTime());
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
    $('#customSearchCategoryWise').on('input', function () {
        
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
    debugger
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

function getColumnsConfig() {
    return [
        { header: "Location", key: "location" },
        { header: "Category", key: "category" },
        { header: "SystemData", key: "systemData" },
        { header: "PhysicalData", key: "physicalData" },
        { header: "VarianceData", key: "varianceData" },
    ];
}

function loadGridAjax() {
    $.ajax({
        url: $('#url_local').val() + "/api/Dashboard/GetAllItemsCategoryWiseOrderByVariance",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({ /*"GET": 1*/ }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            // Handle the successful response
            Bindbody(data, 'tblAllItems')
            
            hideLoader();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }
    });
};

function Bindbody(json, tablename) {
    
    var tr;
    // Define column name to index mapping
    var columnMapping = {
        "location": 0,
        "category": 1,
        "systemQty": 2,
        "physicalQty": 3,
        "qtyVariance": 4,
        "systemValue": 5,
        "actualValue": 6,
        "valueVariance": 7
    };

    $("#" + tablename).DataTable().destroy();
    $("#" + tablename + ' tbody').empty();
    for (var i = 0; i < json.length; i++) {
        tr = $('<tr/>');
        tr.append("<td>" + json[i].location + "</td>");
        tr.append("<td>" + json[i].category + "</td>");
        tr.append("<td>" + json[i].systemQty + "</td>");
        tr.append("<td>" + parseFloat(json[i].physicalQty).toFixed(2) + "</td>");
        tr.append("<td>" + parseFloat(json[i].qtyVariance).toFixed(2) + "</td>");
        tr.append("<td>" + json[i].systemValue + "</td>");
        tr.append("<td>" + parseFloat(json[i].actualValue).toFixed(2) + "</td>");
        tr.append("<td>" + parseFloat(json[i].valueVariance).toFixed(2) + "</td>");
        $("#" + tablename + ' tbody').append(tr);
    };
    var orderColumn = columnMapping["valueVariance"]; // Use the column name to get the index
    $("#" + tablename).DataTable({
        "order": [[orderColumn, 'asc']], // Order by the calculated column index. For no order use "order": [],
        "dom": '<"row justify-content-between top-information"lf>rt<"row justify-content-between bottom-information"ip><"clear">'
    });
};

function showLoader() {

    document.querySelector('.loader-container').style.display = 'block';
};

function hideLoader() {
    document.querySelector('.loader-container').style.display = 'none';
};