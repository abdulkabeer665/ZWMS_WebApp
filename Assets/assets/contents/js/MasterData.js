var loginUserGUID = localStorage.getItem('loginUserGUID');
var yourToken = localStorage.getItem('yourToken')
const disableBTN = document.getElementById('sendDataBtn');

$(document).ready(function () {

    disableBTN.disabled = true;

});

var originalData; // Variable to store the original parsed data

//region Read Tab Delimited File

document.getElementById('customFile').addEventListener('change', function (event) {
    $('body').css('opacity', '0.5');
    //$('.loader').show();
    showLoader();
    var file = event.target.files[0];
    var reader = new FileReader();

    if (file === undefined) {
        $('body').css('opacity', '1');
        //$('.loader').hide();
        hideLoader();
        return;
    }

    reader.onload = function (e) {
        var content = e.target.result;

        // Parse the tab-delimited file without headers
        Papa.parse(content, {
            delimiter: "\t",
            header: false,
            complete: function (results) {
                originalData = results.data; // Store the original parsed data

                // Custom headers
                var customHeaders = [
                    'Sr No', 'Status', 'Item ID', 'Description', 'Category',
                    'Package Type', 'Package Size', 'Qty Per Pack',
                    'Barcode', 'Selling Price', 'Cost Price',
                    'Book Stock', 'Item Type'
                ];

                // Remove blank rows and rows where Selling Price or Cost Price are non-numeric
                originalData = originalData.filter(row => {
                    const sellingPrice = row[8];
                    const costPrice = row[9];
                    const isSellingPriceNumeric = !isNaN(parseFloat(sellingPrice)) && isFinite(sellingPrice);
                    const isCostPriceNumeric = !isNaN(parseFloat(costPrice)) && isFinite(costPrice);

                    return row.every(cell => {
                        if (typeof cell === 'string') {
                            return cell.trim() !== '';
                        } else {
                            return !!cell;
                        }
                    }) && isSellingPriceNumeric && isCostPriceNumeric;
                });

                // Map rows to objects with custom headers
                var data = originalData.map((row, rowIndex) => {
                    let obj = { 'Sr No': rowIndex + 1 };
                    customHeaders.slice(2).forEach((header, index) => {
                        obj[header] = row[index];
                    });
                    // Adding Status based on length of row
                    if (row.length == customHeaders.length - 2) {
                        obj['Status'] = 'Success';
                    } else {
                        obj['Status'] = 'Error';
                    }
                    return obj;
                });

                if (data.length == 0) {
                    swal("Cancelled", "File format is not correct!", "error");
                }
                else {
                    disableBTN.disabled = false;
                }

                // Check if the DataTable is already initialized
                if ($.fn.DataTable.isDataTable('#data-table')) {
                    $('#data-table').DataTable().clear().destroy();
                }

                // Initialize DataTable
                $('#data-table').DataTable({
                    data: data,
                    columns: customHeaders.map(header => ({ title: header, data: header })),
                    columnDefs: [
                        { targets: [6, 8, 9], className: 'dt-right' }, // Right-align specific columns
                        { targets: [0, 2], className: 'description-column' } // Apply custom class to description column
                    ],
                    createdRow: function (row, data, dataIndex) {
                        if (data.Status === 'Error') {
                            $('td', row).eq(1).css({
                                'color': 'red',
                                'font-weight': 'bold'
                            });
                        } else if (data.Status === 'Success') {
                            $('td', row).eq(1).css({
                                'color': 'green',
                                'font-weight': 'bold'
                            });
                        }
                    }
                });

                // Reset opacity and hide loader
                $('body').css('opacity', '1');
                //$('.loader').hide();
                hideLoader();
            }
        });
    };

    reader.readAsText(file);
});

//endregion

//region Send data to Import Master Data API

document.getElementById('sendDataBtn').addEventListener('click', function () {
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
            //$('.loader').show();
            showLoader();

            // Filter out rows where Status is 'Error'
            var filteredData = originalData.filter(row => {
                let statusIndex = 1; // Assuming Status is the second column
                var len = row.length;

                if (len == 11) {
                    return row[statusIndex] !== 'Error' && !row.some(param => param === undefined);
                };

            });

            // Map the filtered data to the desired structure
            var requestData = filteredData.map(row => ({
                "uoM_Code": "1", // Set appropriate values from your data
                "uoM_EngName": "Default",
                "uoM_Name": "Default",
                "itemPackageType_Code": row[3],
                "itemPackageType_EngName": row[4],
                "itemCategory_Code": 17,
                "itemCategory_EngName": row[2],
                "itemCategory_Name": row[2],
                "itemCategory_ParentGUID": "",
                "item_Code": row[0], // Assuming 'Item ID' is at index 1 in the original data
                "item_EngName": row[1], // Assuming 'Description' is at index 2 in the original data
                "item_Name": row[1], // If 'Description' should go here, adjust accordingly
                "item_Type": row[10], // Assuming 'Item Type' is at index 11 in the original data
                "item_Price": parseFloat(row[8]), // Assuming 'Selling Price' is at index 8 in the original data
                "itemSKU_Barcode": row[6], // Assuming 'Barcode' is at index 7 in the original data
                "itemSKU_SellingPrice": parseFloat(row[7]), // Assuming 'Selling Price' is at index 8 in the original data
                "itemSKU_BookStock": parseInt(row[9]), // Assuming 'Book Stock' is at index 10 in the original data
                "itemSKU_PackSize": row[4], // Assuming 'Package Size' is at index 5 in the original data
                "itemSKU_CostPrice": parseFloat(row[8]), // Assuming 'Cost Price' is at index 9 in the original data
                "itemSKU_PiecesQty": parseFloat(row[5]), // Assuming 'Qty Per Pack' is at index 6 in the original data
                "createdBy": loginUserGUID,
                "lastEditBy": loginUserGUID
            }));

            if (requestData.length > 0) {
                sendDataToAPI(requestData);
            }
            else {
                $('body').css('opacity', '1');
                //$('.loader').hide();
                hideLoader();
                swal("Cancelled", "The data won't be import due to error!", "error");
                return;
            }

        } else {
            $('body').css('opacity', '1');
            //$('.loader').hide();
            hideLoader();
            swal("Cancelled", "The data is not imported!", "error");

        }

        //// Reset opacity and hide loader
        //$('body').css('opacity', '1');
        ////$('.loader').hide();
        //hideLoader();
    });
});

function sendDataToAPI(data) {

    $.ajax({
        url: $('#url_local').val() + "/api/Import/MasterData", // Get the API endpoint URL
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ importMasterData: data }),
        headers: { 'Authorization': 'Bearer ' + yourToken },
        success: function (response) {

            //console.log(response); // Log the response from the server
            importMasterDataResponse(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error sending data to API:', errorThrown);
        }
    });
};

function importMasterDataResponse(response) {
    $('body').css('opacity', '1');
    var reponseMessage = response[0]['message'];
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
        }).then((Save) => {
            if (Save) {
                //$('.loader').hide();
                hideLoader();
                location.href = '';
            }
        })

    }
};

//endregion

$("#clearDataBtn").click(function () {
    swal({
        title: "Are you sure?",
        text: "You want to Clear Master Data!",
        icon: "warning",
        buttons: [
            'No, cancel it!',
            'Yes, I am sure!'
        ],
        dangerMode: true,
    }).then(function (isConfirm) {
        if (isConfirm) {
            
            $('body').css('opacity', '0.5');
            //$('.loader').show();
            showLoader();
            clearMasterData();
            setTimeout(showSwal, 3000);
            return;
        }
        else {
            $('body').css('opacity', '1');
            //$('.loader').hide();
            hideLoader();
            swal("Cancelled", "Your data is safe!", "error");
            return;
        }

        // Reset opacity and hide loader
        $('body').css('opacity', '1');
        //$('.loader').hide();
        hideLoader();
    });
});

function clearMasterData() {
    $.ajax({
        url: $('#url_local').val() + "/api/Import/ClearMasterData", // Get the API endpoint URL
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ }),
        headers: { 'Authorization': 'Bearer ' + yourToken },
        success: function (response) {

            return true;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            return false;
        }
    });
    
};

function showSwal() {
    $('body').css('opacity', '1');
    //$('.loader').hide();
    hideLoader();
    swal("Success", "Master deleted successfully.", "success");
}

function showLoader() {

    document.querySelector('.loader-container').style.display = 'block';
};

function hideLoader() {
    document.querySelector('.loader-container').style.display = 'none';
};