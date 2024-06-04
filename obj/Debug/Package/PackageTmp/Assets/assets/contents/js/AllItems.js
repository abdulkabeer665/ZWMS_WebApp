var yourToken;
var loginName;

$(window).on('load', function () {
    yourToken = sessionStorage.getItem('yourToken');
    loginName = sessionStorage.getItem('loginName');
    $('.loader').show();
    loadGridAjax();
});

function loadGridAjax() {
    $.ajax({
        url: $('#url_local').val() + "/api/Dashboard/GetAllItemsOrderByVariance",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({ /*"GET": 1*/ }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            // Handle the successful response
            //FillGridHandler(data);
            Bindbody(data, 'tblAllItems')
            $('.loader').hide();
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
        "itemNo": 0,
        "description": 1,
        "systemQty": 2,
        "physicalQty": 3,
        "qtyVariance": 4,
        "systemValue": 5,
        "actualValue": 6,
        "valueVariance": 7,
        "unitPerCost": 8,
        "category": 9,
        "productGroup": 10,
        "location": 11,
        "division": 12
    };

    $("#" + tablename).DataTable().destroy();
    $("#" + tablename + ' tbody').empty();
    for (var i = 0; i < json.length; i++) {
        tr = $('<tr/>');
        tr.append("<td>" + json[i].itemNo + "</td>");
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
        tr.append("<td>" + json[i].location + "</td>");
        tr.append("<td>" + json[i].division + "</td>");
        $("#" + tablename + ' tbody').append(tr);
    };
    var orderColumn = columnMapping["valueVariance"]; // Use the column name to get the index
    $("#" + tablename).DataTable({
        "order": [[orderColumn, 'asc']], // Order by the calculated column index. For no order use "order": [],
        "dom": '<"row justify-content-between top-information"lf>rt<"row justify-content-between bottom-information"ip><"clear">'
    });
};