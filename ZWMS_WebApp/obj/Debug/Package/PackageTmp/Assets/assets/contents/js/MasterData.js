var loginUserGUID = localStorage.getItem('loginUserGUID');
var yourToken = localStorage.getItem('yourToken')
const disableBTN = document.getElementById('sendDataBtn');

$(document).ready(function () {

    disableBTN.disabled = true;

});

var originalData; // Variable to store the original parsed data
let processedData = [];
let validCount = 0;
let invalidCount = 0;

//region Read Tab Delimited File

document.getElementById('customFile').addEventListener('change', function (event) {
    $('body').css('opacity', '0.5');
    showLoader();

    const file = event.target.files[0];
    const reader = new FileReader();
    debugger
    if (file === undefined) {
        $('body').css('opacity', '1');
        hideLoader();
        return;
    }

    reader.onload = function (e) {
        const content = e.target.result;

        Papa.parse(content, {
            delimiter: "\t",
            header: false,
            complete: function (results) {
                originalData = results.data;

                const customHeaders = [
                    'Sr No', 'Status', 'Item ID', 'Description', 'Category',
                    'Package Type', 'Package Size', 'Qty Per Pack',
                    'Barcode', 'Selling Price', 'Cost Price',
                    'Book Stock', 'Item Type'
                ];

                let srNo = 1;

                originalData.forEach((row, index) => {
                    const isRowEmpty = row.every(cell => (typeof cell === 'string' ? cell.trim() === '' : cell === null || cell === undefined));
                    if (isRowEmpty) return;

                    row[5] = (row[5] || '').toString().replace(",", "");
                    row[7] = (row[7] || '').toString().replace(",", "");
                    row[8] = (row[8] || '').toString().replace(",", "");

                    const sellingPrice = row[7];
                    const costPrice = row[8];

                    const isSellingPriceNumeric = !isNaN(parseFloat(sellingPrice)) && isFinite(sellingPrice);
                    const isCostPriceNumeric = !isNaN(parseFloat(costPrice)) && isFinite(costPrice);

                    let status = "";
                    if (!row[0]) status += "Item ID is empty. ";
                    if (!row[1]) status += "Description is empty. ";
                    if (!row[2]) status += "Category is empty. ";
                    if (!row[3]) status += "Package Type is empty. ";
                    if (!row[5]) status += "Package Size is empty. ";
                    if (!row[6]) status += "Barcode is empty. ";

                    if (!row[7]) {
                        status += "Selling Price is empty. ";
                    } else if (!isSellingPriceNumeric) {
                        status += "Selling Price is invalid. ";
                    }

                    if (!row[8]) {
                        status += "Cost Price is empty. ";
                    } else if (!isCostPriceNumeric) {
                        status += "Cost Price is invalid. ";
                    }

                    if (row[10] !== "Stockable" && row[10] !== "Lot Item") {
                        status += "Invalid Item Type (Stockable, Lot Item). ";
                    }

                    if (status === "") {
                        status = "Success";
                        validCount++; // ✅ increment valid
                    } else {
                        status += "Error";
                        invalidCount++; // ❌ increment invalid
                    }

                    const obj = { 'Sr No': srNo++, 'Status': status };
                    customHeaders.slice(2).forEach((header, i) => {
                        obj[header] = row[i];
                    });

                    processedData.push(obj);
                });

                if (processedData.length === 0) {
                    swal("Cancelled", "File format is not correct!", "error");
                } else {
                    disableBTN.disabled = false;
                }

                if ($.fn.DataTable.isDataTable('#data-table')) {
                    $('#data-table').DataTable().clear().destroy();
                }

                $('#data-table').DataTable({
                    data: processedData,
                    columns: customHeaders.map(header => ({ title: header, data: header })),
                    columnDefs: [
                        { targets: [6, 8, 9], className: 'dt-right' },
                        { targets: [0, 2], className: 'description-column' }
                    ],
                    createdRow: function (row, data) {
                        if (data.Status.includes('Error')) {
                            $('td', row).eq(1).css({ 'color': 'red', 'font-weight': 'bold' });
                        } else if (data.Status === 'Success') {
                            $('td', row).eq(1).css({ 'color': 'green', 'font-weight': 'bold' });
                        }
                    }
                });

                $('body').css('opacity', '1');
                hideLoader();

                // Update counts
                document.getElementById("validRecords").textContent = validCount;
                document.getElementById("invalidRecords").textContent = invalidCount;

                // Apply colors
                document.getElementById("validRecords").style.color = "green";
                document.getElementById("invalidRecords").style.color = "red";
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

            // Filter out rows where Status is 'Error'
            //var filteredData = originalData.filter(row => {
            //    let statusIndex = 1; // Assuming Status is the second column
            //    var len = row.length;

            //    if (len == 11) {
            //        return row[statusIndex] !== 'Error' && !row.some(param => param === undefined);
            //    };

            //});

            // Map the filtered data to the desired structure

            showLoader();

            processedData = processedData.map(obj => Object.values(obj)).filter(row => !String(row[1]).includes("Error")).map(row => row.slice(2));

            var requestData = processedData.map(row => ({
                
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
                //,"responseHandler": 0
            }));

            if (requestData.length > 0) {
                //sendChunksSequentially(requestData);
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

async function sendChunksSequentially(data) {

    debugger
    const chunkSize = parseInt($("#importDataBreakDown").val());
    //const chunkSize = 20000;
    const total = data.length;

    for (let i = 0; i < total; i += chunkSize) {
        let chunk = data.slice(i, i + chunkSize);
        let isLastChunk = (i + chunkSize >= total);

        if (isLastChunk) {
            chunk.forEach(item => item.responseHandler = 1);
        }

        try {
            const response = await fetch($('#url_local').val() + "/api/Import/ImportMasterDataBulkInsert", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + yourToken
                },
                body: JSON.stringify({ importMasterData: chunk })
            });

            const result = await response.json();
            console.log(`✅ Chunk ${i} - ${i + chunk.length - 1} sent successfully`, result);
        } catch (error) {
            console.error(`❌ Error in chunk ${i} - ${i + chunk.length - 1}:`, error);
            break; // Stop on error if needed
        }
    }
};

function sendDataToAPI(data) {
    debugger
    $.ajax({
        url: $('#url_local').val() + "/api/Import/ImportMasterDataBulkInsert", // Get the API endpoint URL
        //url: $('#url_local').val() + "/api/Import/MasterData", // Get the API endpoint URL
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
            $('body').css('opacity', '1');
            hideLoader();
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
        data: JSON.stringify({}),
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