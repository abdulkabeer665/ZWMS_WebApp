var loginUserGUID = sessionStorage.getItem('loginUserGUID');
var yourToken = sessionStorage.getItem('yourToken')
const disableBTN = document.getElementById('sendDataBtn');

$(document).ready(function () {
    disableBTN.disabled = true;
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

//region Read Tab Delimited File

var originalData; // Variable to store the original parsed data

document.getElementById('customFile').addEventListener('change', function (event) {
    $('body').css('opacity', '0.5');
    $('.loader').show();
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
        var content = e.target.result;
        // Parse the tab-delimited file without headers
        var results = Papa.parse(content, {
            delimiter: "\t",
            header: false,
            complete: function (results) {
                originalData = results.data; // Store the original parsed data
                // Custom headers
                var customHeaders = [
                    'Sr No', 'Item ID', 'Book Stock', 'Unit Cost', 'Status'
                ];

                // Remove blank rows
                originalData = originalData.filter(row => {
                    return Object.values(row).every(cell => {
                        if (typeof cell === 'string') {
                            return cell.trim() !== '';
                        } else {
                            return !!cell;
                        }
                    });
                });

                // Map rows to objects with custom headers
                var data = originalData.map((row, rowIndex) => {
                    //var data = results.data.map((row, rowIndex) => {

                    let obj = { 'Sr No': rowIndex + 1 };
                    customHeaders.slice(1, -1).forEach((header, index) => {
                        obj[header] = row[index];
                    });
                    //if (row.length != 11) {
                    obj['Status'] = 'Success';
                    //}
                    return obj;
                });

                // Initialize DataTable
                $('#data-table').DataTable({
                    data: data,
                    columns: customHeaders.map(header => ({ title: header, data: header }))
                });
            }
        });
    };

    reader.readAsText(file);
    $('body').css('opacity', '1');
    disableBTN.disabled = false;
    $('.loader').hide();

});

//endregion

//region Send data to Import Master Data API

document.getElementById('sendDataBtn').addEventListener('click', function () {
    var invPerSelection = parseInt($("#invPeriodSelect").val());
    var invPerLocationSelection = parseInt($("#invPeriodwiseLocation").val());
    if (invPerSelection < 1) {
        alert("Please Select Inventory Period")
        return;
    }
    else
    if (invPerLocationSelection = 0) {
        alert("Please Select Location")
        return;
    }
    else {
        swal({
            title: "Are you sure?",
            text: "You want to Import Master Data!",
            icon: "warning",
            buttons: [
                'No, cancel it!',
                'Yes, I am sure!'
            ],
            dangerMode: true,
        }).then(function (isConfirm) {
            if (isConfirm) {
                $('body').css('opacity', '0.5');
                $('.loader').show();
                var filteredData = originalData.filter(row => !row.some(param => param === undefined));
                // Map the filtered data to the desired structure
                var requestData = filteredData.map(row => ({
                    "item_Code": row[0], // Assuming 'Item ID' is at index 1 in the original data
                    "BookStockInventory": row[1],
                    "UnitCostPrice": row[2],
                    "inventoryPeriodID": invPerSelection,
                    "warehouseGUID": $("#invPeriodwiseLocation").val(),
                    "createdBy": loginUserGUID,
                    "lastEditBy": loginUserGUID
                }));

                sendDataToAPI(requestData);

            }
            else {
                swal("Cancelled", "The data is not imported!", "error");
            }        
        })
    }
});

function sendDataToAPI(data) {
    $.ajax({
        url: $('#url_local').val() + "/api/Import/BookStockInventory", // Get the API endpoint URL
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ importBookStockInventory: data }),
        headers: { 'Authorization': 'Bearer ' + yourToken },
        success: function (response) {
            //console.log('Data sent successfully');
            //console.log(response); // Log the response from the server
            importResponse(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error sending data to API:', errorThrown);
        }
    });
};

function importResponse(response) {
    $('body').css('opacity', '1');
    var reponseMessage = response.message;
    if (reponseMessage.includes("Already")) {
        swal({
            title: reponseMessage + "...",
            icon: "warning",
            button: "OK",
        }).then((exist) => {
            if (exist) {
                location.href = '';
            }
        })
    }
    else {
        swal({
            title: reponseMessage + "...",
            icon: "success",
            button: "OK",
        })
            .then((Save) => {
                if (Save) {
                    $('.loader').hide();
                    location.href = '';
                }
            })

    }
};

//endregion