var loginUserGUID = sessionStorage.getItem('loginUserGUID');
var yourToken = sessionStorage.getItem('yourToken')
const disableBTN = document.getElementById('sendDataBtn');

$(document).ready(function () {

    disableBTN.disabled = true;

});

var originalData; // Variable to store the original parsed data

//region Read Tab Delimited File

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
                    'Sr No', 'Item ID', 'Description', 'Category',
                    'Package Type', 'Package Size', 'Qty Per Pack',
                    'Barcode', 'Selling Price', 'Cost Price',
                    'Book Stock', 'Item Type', 'Status'
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
                    columns: customHeaders.map(header => ({ title: header, data: header })),
                    columnDefs: [
                        /*{ targets: [6, 8, 9], className: 'dt-right' } // Right-align specific columns*/
                        { targets: [6, 8, 9], className: 'dt-right' }, // Right-align specific columns
                        { targets: [0, 2], className: 'description-column' } // Apply custom class to description column
                    ]
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
                "itemSKU_PiecesQty": parseInt(row[5]), // Assuming 'Qty Per Pack' is at index 6 in the original data
                "createdBy": loginUserGUID,
                "lastEditBy": loginUserGUID
            }));

            sendDataToAPI(requestData);
        }
        else {
            swal("Cancelled", "The data is not imported!", "error");
        }

    })

});

function sendDataToAPI(data) {
    $.ajax({
        url: $('#url_local').val() + "/api/Import/MasterData", // Get the API endpoint URL
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ importMasterData: data }),
        headers: { 'Authorization': 'Bearer ' + yourToken },
        success: function (response) {
            //console.log('Data sent successfully');
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