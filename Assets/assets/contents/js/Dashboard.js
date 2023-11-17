var yourToken = sessionStorage.getItem('yourToken')
var loginName = sessionStorage.getItem('loginName')
$(window).on('load', function () {
    filldropdowninventory()
    loadinventcount()
    loadanonymouscount()
    loadselection()
    startTimer()
    VarianceInfo()


  
});

function filldropdowninventory() {
    $.ajax({
        url: $('#url_local').val() + "/api/Inventory/GetAllInventories",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({
            "GET": 1,
            "web": 1

        }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            // Handle the successful response
            ddlHandler(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }

    })
    
}
function ddlHandler(response) {

   
    // debugger;
    fillddls('inventories', 'All', response)
}
$("#inventories").change(function () {
 
    loadinventselectedcount()
    loadanonymouscount()
})
function fillddls(name, selecttext, data) {
    $("#" + name).empty();
    var s = '<option value="0">' + selecttext + '</option>';
    //for (var i = 0; i < data.length; i++) {
    //    s += '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
    //}
    $.each(data, function (index, item) {
        s += '<option value="' + item.guid + '">' + item.engName + '</option>';

    });
    $("#" + name).html(s);

}

function loadinventcount() { 

    if ($("#inventories option:selected").text() == "All" || $("#inventories option:selected").text() == "") {
      
        $.ajax({
            url: $('#url_local').val() + "/api/Dashboard/GetAllInventoryItemsCount",
            type: 'POST',
            contentType: 'application/json', // Set the content type based on your API requirements
            data: JSON.stringify({
                "all": 1,


            }), // Adjust the payload format based on your API
            headers: {
                'Authorization': 'Bearer ' + yourToken
            },
            success: function (data) {
                // Handle the successful response
                FillGridHandlerAllInvent(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle the error
                console.log('AJAX Error: ' + textStatus, errorThrown);
                console.log(jqXHR.responseText); // Log the response for more details
            }

        })
    }
    else {
    
        $.ajax({
            url: $('#url_local').val() + "/api/Dashboard/GetAllInventoryItemsCount",
            type: 'POST',
            contentType: 'application/json', // Set the content type based on your API requirements
            data: JSON.stringify({
                "inventoryGUID": $("#inventories").val(),


            }), // Adjust the payload format based on your API
            headers: {
                'Authorization': 'Bearer ' + yourToken
            },
            success: function (data) {
                // Handle the successful response
                FillGridHandlerAllInvent(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle the error
                console.log('AJAX Error: ' + textStatus, errorThrown);
                console.log(jqXHR.responseText); // Log the response for more details
            }

        })
    }
}
function loadinventselectedcount() {
   
    $.ajax({
        url: $('#url_local').val() + "/api/Dashboard/GetAllInventoryItemsCount",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({
            "inventoryGUID": $("#inventories").val(),


        }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            // Handle the successful response
            FillGridHandlerAllInvent(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }

    })
}
function FillGridHandlerAllInvent(response) {
   
    $("#slab1").text(response.table1[0]["totalItemsCount"])
    $("#slab2").text(response.returnTable[0]["foundInventoryItemsCount"])
    
};
function loadanonymouscount() {
    if ($("#inventories option:selected").text() == "All" || $("#inventories option:selected").text() == "") {

        $.ajax({
            url: $('#url_local').val() + "/api/Dashboard/GetAllAnonymousItemsCount",
            type: 'POST',
            contentType: 'application/json', // Set the content type based on your API requirements
            data: JSON.stringify({
                "all": 1,


            }), // Adjust the payload format based on your API
            headers: {
                'Authorization': 'Bearer ' + yourToken
            },
            success: function (data) {
                // Handle the successful response
                FillGridHandlerAllAnonymous(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle the error
                console.log('AJAX Error: ' + textStatus, errorThrown);
                console.log(jqXHR.responseText); // Log the response for more details
            }

        })
    } else {
        $.ajax({
            url: $('#url_local').val() + "/api/Dashboard/GetAllAnonymousItemsCount",
            type: 'POST',
            contentType: 'application/json', // Set the content type based on your API requirements
            data: JSON.stringify({
                "inventoryGUID": $("#inventories").val(),


            }), // Adjust the payload format based on your API
            headers: {
                'Authorization': 'Bearer ' + yourToken
            },
            success: function (data) {
                // Handle the successful response
                FillGridHandlerAllAnonymous(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle the error
                console.log('AJAX Error: ' + textStatus, errorThrown);
                console.log(jqXHR.responseText); // Log the response for more details
            }
        })
    }
}

function FillGridHandlerAllAnonymous(response) {
    $("#slab3").text(response.returnTable[0]["foundAnonymousItems"])
};

function startTimer() {

    timer = setInterval(function () {
        loadinventcount()
        loadanonymouscount()
        loadselection()
        VarianceInfo()
    }, 5000);

}

$("#selection").change(function () {
    loadselection()
});

function loadselection() {
    if ($("#selection").val() == "Inventory") {
        $("#myselect").text("Anonymous Items found in Inventories")
        
        $.ajax({
            url: $('#url_local').val() + "/api/Dashboard/GetAllInventoryItemsCountAgainstInventoryOrDevice",
            type: 'POST',
            contentType: 'application/json', // Set the content type based on your API requirements
            data: JSON.stringify({
                "Inventory": 1,


            }), // Adjust the payload format based on your API
            headers: {
                'Authorization': 'Bearer ' + yourToken
            },
            success: function (data) {
                // Handle the successful response
                FillGridHandlerSelection(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle the error
                console.log('AJAX Error: ' + textStatus, errorThrown);
                console.log(jqXHR.responseText); // Log the response for more details
            }

        })
    }
    if ($("#selection").val() == "Device") {
        $("#myselect").text("Anonymous Items found by Devices")
       
        $.ajax({
            url: $('#url_local').val() + "/api/Dashboard/GetAllInventoryItemsCountAgainstInventoryOrDevice",
            type: 'POST',
            contentType: 'application/json', // Set the content type based on your API requirements
            data: JSON.stringify({
                "Device": 1,


            }), // Adjust the payload format based on your API
            headers: {
                'Authorization': 'Bearer ' + yourToken
            },
            success: function (data) {
                // Handle the successful response
                FillGridHandlerSelection(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle the error
                console.log('AJAX Error: ' + textStatus, errorThrown);
                console.log(jqXHR.responseText); // Log the response for more details
            }

        })
    }

}

function FillGridHandlerSelection(response) {
    $('#mylist').empty();
    for (i = 0; i < response.returnTable.length; i++) {
        $('#mylist').append("<tr><td><span class='badge-dot bg-twitter me-2'></span> <span class='fw-medium'>" + response.returnTable[i].name + "</span></td><td>" + response.returnTable[i].count +"</td></tr>");
    }        
};

function VarianceInfo() {

    $.ajax({
        url: $('#url_local').val() + "/api/Dashboard/GetVarianceInfo",
        type: 'GET',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({}), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            // Handle the successful response
            divFunction(data)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }

    })

};

function divFunction(data) {
    $('#performanceTable').empty();
    $('#progressBarDiv').empty();
    var countArray = [];
    var color = '';
    var colorArray = ['primary', 'success', 'orange', 'pink', 'info', 'indigo'];
    var responseCount = 0;
    for (var i = 0; i < data.returnTable.length; i++) {
        responseCount = responseCount + data.returnTable[i]["count"];
    }
    for (var j = 0; j < data.returnTable.length; j++) {
        countArray[j] = (data.returnTable[j]["count"] / responseCount) * 100;
        countArray[j] = Math.round(countArray[j] / 5) * 5;
        color = colorArray[j]
        $("#progressBarDiv").append('<div class="progress-bar bg-' + color + ' w-' + countArray[j].toLocaleString() + '" role="progressbar" aria-valuenow="' + countArray[j].toLocaleString() + '" aria-valuemin="0" aria-valuemax="100"></div>')
        $("#performanceTable").append('<tbody><tr><td><div class="badge-dot bg-' + color + '"></div></td><td>' + data.returnTable[j]["name"] + '</td><td>' + data.returnTable[j]["count"].toLocaleString() + '</td><td>' + data.returnTable[j]["percentage"] + '%</td></tr></tbody>');
    }    
}