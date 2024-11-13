var yourToken;
var loginName;

$(window).on('load', function () {
    yourToken = sessionStorage.getItem('yourToken');
    loginName = sessionStorage.getItem('loginName');
    showLoader();
    filldropdownWarehouse()
    hideLoader();

    $('.datepicker').datepicker();
    $('.datepicker2').datepicker();
    loadGridAjax();
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
function loadGridAjax() {
    
};
$("#warehouse").change(function () {
    if ($("#warehouse").val() == "") {
       
        $("#inventory" + name).empty();
        var s = '<option value="">' + "All" + '</option>';
        $("#inventory").html(s);
    }
    else {
    filldropdownInventory()
    }
})


$('#btngen').click(function () {
    {
        showLoader();

        $.ajax({
            url: $('#url_local').val() + "/api/Dashboard/GetAllItemsOrderByVariance",
            type: 'POST',
            contentType: 'application/json', // Set the content type based on your API requirements
            data: JSON.stringify({
                "Flag": "Sum",
                "From": $("#From").val() + " " + frmtime,
                "To": $("#To").val() + " " + endtime,
                "locationGUID": $("#warehouse").val(),
                "inventoryGUID": $("#inventory").val(),


            }), // Adjust the payload format based on your API
            //data: JSON.stringify({ /*"GET": 1*/ }), // Adjust the payload format based on your API
            headers: {
                'Authorization': 'Bearer ' + yourToken
            },
            success: function (data) {
                
                // Handle the successful response
                //FillGridHandler(data);
                Bindbody(data, 'tblAllItems')
                hideLoader();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle the error
                console.log('AJAX Error: ' + textStatus, errorThrown);
                console.log(jqXHR.responseText); // Log the response for more details
            }
        });

        //for second tab indivisual

        $.ajax({
            url: $('#url_local').val() + "/api/Dashboard/GetAllItemsOrderByVariance",
            type: 'POST',
            contentType: 'application/json', // Set the content type based on your API requirements
            data: JSON.stringify({
                "Flag": "Ind",
                "From": $("#From").val() + " " + frmtime,
                "To": $("#To").val() + " " + endtime,
                "locationGUID": $("#warehouse").val(),
                "inventoryGUID": $("#inventory").val(),
            }), // Adjust the payload format based on your API
            headers: {
                'Authorization': 'Bearer ' + yourToken
            },
            success: function (data) {
                
                // Handle the successful response
                //FillGridHandler(data);
                Bindbody2(data, 'tblAllItems2')
                hideLoader();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle the error
                console.log('AJAX Error: ' + textStatus, errorThrown);
                console.log(jqXHR.responseText); // Log the response for more details
            }
        });
    }
})

function Bindbody(json, tablename) {
  console.log(json)
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

                        // Create a download link
                        let encodedUri = encodeURI(csvContent);
                        let link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", "Variance_Report_Indivisual.csv");

                        // Append the link to the document and trigger the download
                        document.body.appendChild(link);
                        link.click();

                        // Remove the link after download
                        document.body.removeChild(link);

                    } else {
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