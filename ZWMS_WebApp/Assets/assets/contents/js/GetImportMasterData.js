var loginUserGUID = localStorage.getItem('loginUserGUID');
var yourToken = localStorage.getItem('yourToken')

$(document).ready(function () {

    //GetImportedMasterData();

    loadGridAjax("tblMasterData")
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

var searchTimeout;

var searchTerm = "2"

function loadGridAjax(tableName) {
    
    showLoader();
    $("#" + tableName).DataTable().destroy();
    $("#" + tableName + " tbody").empty();

    var table = $("#" + tableName).DataTable({
        "processing": false, // Disable the default "Processing" message
        "serverSide": true, // Enable server-side pagination
        "searching": false, // Disable default search behavior
        "order": [[0, "asc"]],
        "ajax": {
            url: $('#url_local').val() + "/api/Import/GetImportMasterData", // Get the API endpoint URL
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
                    pageIndex: d.start / d.length,
                    searchValue: d.search.value,
                    sortColumn: sortColumn,
                    searchTerm: searchTermVal
                });
            },
            dataSrc: function (json) {
                hideLoader();
                return json.data;
            }
        },
        "columns": [

            { "data": "itemCode" },
            { "data": "engName" },
            { "data": "category" },
            { "data": "packageTypeCode" },
            { "data": "packageType" },
            { "data": "packSize" },
            { "data": "piecesQty" },
            { "data": "barcode" },
            { "data": "sellingPrice" },
            { "data": "costPrice" },
        ],
        "dom": 'lBfrtip',
        "buttons": [
            {
                extend: 'excelHtml5',
                text: '<button class="btn btn-success"><i class="fa-solid fa-file-excel" style="font-size: 25px;"></i></button>',
                titleAttr: 'Export to Excel',
                filename: "Master Data Export_XLS" + "_" + getCurrentDateTime(),
                //filename: $("#pageheading").text() + "_" + getCurrentDateTime(),
                action: function (e, dt, button, config) {
                    
                    console.log(dt.order)
                    const orderColumnIndex = dt.order[0]?.column;
                    const orderDirection = dt.order[0]?.dir; // Ascending or descending
                    const orderColumnName = dt.columns[orderColumnIndex]?.data; // Column name


                    // Concatenate column name and order direction
                    const sortColumn = `${orderColumnName} ${orderDirection}`;

                    showLoader()
                    
                    $.ajax({
                        url: $('#url_local').val() + "/api/Import/GetImportMasterData", // Get the API endpoint URL
                        type: 'POST',
                        contentType: 'application/json',
                        headers: {
                            'Authorization': 'Bearer ' + yourToken
                        },
                        data: JSON.stringify({
                            //"UserID": createdBy,
                            //"Flag": $("#flag").val(),
                            "pageIndex": 0, // First page
                            "pageSize": dt.ajax.json().recordsTotal, // Fetch all records
                            "searchTerm": $('#customSearch').val(),
                            "sortColumn": sortColumn
                            //"sortColumn": dt.order()[0][0] + " " + dt.order()[0][1]
                        }),
                        success: function (response) {
                            
                            // Export all data to Excel
                            const allData = response.data;
                            exportToExcel(allData, getColumnsConfig(), "Master Data Export_XLS" + "_" + getCurrentDateTime());
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
}

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
        wsData.push(columns.map(col => row[col.key] || ""));
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    XLSX.writeFile(wb, `${filename}.xlsx`);
};

function getColumnsConfig() {
    return [
        { header: "Item Code", key: "itemCode" },
        { header: "Eng Name", key: "engName" },
        { header: "Category", key: "category" },
        { header: "Package Type Code", key: "packageTypeCode" },
        { header: "Package Type", key: "ppackageType" },
        { header: "Item Pack Size", key: "ipackSize" },
        { header: "Pieces Qty", key: "piecesQty" },
        { header: "Barcode", key: "barcode" },
        { header: "Selling Price", key: "sellingPrice" },
        { header: "Cost Price", key: "costPrice" },
    ];
}

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