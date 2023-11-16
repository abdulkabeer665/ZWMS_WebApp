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
        //VarianceInfo()
    }, 5000);

}

$("#selection").change(function () {
    loadselection()
});

function loadselection() {
    if ($("#selection").val() == "Inventory") {
        $("#myselect").text("Anonymous Items found in Inventories")
        $('#mylist').empty();
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
        $('#mylist').empty();
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

    var myDiv1 = document.getElementById('myDiv1');
    var myDiv2 = document.getElementById('myDiv2');
    var myDiv3 = document.getElementById('myDiv3');
    var myDiv4 = document.getElementById('myDiv4');
    var myDiv5 = document.getElementById('myDiv5');
    var myDiv6 = document.getElementById('myDiv6');

    //console.log("Count ===>>> " + data.returnTable[0]["count"]);
    //console.log("Name ===>>> " + data.returnTable[0]["name"]);
    //console.log("TotalItemsCount ===>>> " + data.returnTable[0]["totalItemsCount"]);
    //console.log("Percentage ===>>> " + data.returnTable[0]["percentage"]);
    
    //for (var i = 0; i < 6; i++) {

        //var count = data.returnTable[i]["count"]

        if (myDiv1 !== null) {
            var length = data.returnTable[0]["count"];
            console.log(length)
            // Set the aria-valuenow attribute
            myDiv1.classList.add('w-' + length);
            myDiv1.setAttribute('aria-valuenow', length);
        }
        else {
            console.error('Element with id "myDiv1" not found.');
        }
        if (myDiv2 !== null) {
            var length = '25';
            // Set the aria-valuenow attribute
            myDiv2.classList.add('w-' + length);
            myDiv2.setAttribute('aria-valuenow', length);
        }
        else {
            console.error('Element with id "myDiv2" not found.');
        }
        if (myDiv3 !== null) {
            var length = '5';
            // Set the aria-valuenow attribute
            myDiv3.classList.add('w-' + length);
            myDiv3.setAttribute('aria-valuenow', length);
        }
        else {
            console.error('Element with id "myDiv3" not found.');
        }
        if (myDiv4 !== null) {
            var length = '5';
            // Set the aria-valuenow attribute
            myDiv4.classList.add('w-' + length);
            myDiv4.setAttribute('aria-valuenow', length);
        }
        else {
            console.error('Element with id "myDiv4" not found.');
        }
        if (myDiv5 !== null) {
            var length = '10';
            // Set the aria-valuenow attribute
            myDiv5.classList.add('w-' + length);
            myDiv5.setAttribute('aria-valuenow', length);
        }
        else {
            console.error('Element with id "myDiv5" not found.');
        }
        if (myDiv6 !== null) {
            var length = '5';
            // Set the aria-valuenow attribute
            myDiv6.classList.add('w-' + length);
            myDiv6.setAttribute('aria-valuenow', length);
        }
        else {
            console.error('Element with id "myDiv6" not found.');
        }

    //}
    

    
}