

var apiCallFlag = 0;
var showScannedItemsCheckboxVal = 0;

$(window).on('load', function () {
    
    var yourToken = localStorage.getItem('yourToken')
    var loginName = localStorage.getItem('loginName')
    if (loginName == "" || loginName == null) {
        window.location.href = $("#front_URL").val() + "/Login/Index";
    }
    else {
        $("#loginName").text(loginName);

        filldropdownYears();        
        filldropdownDivisions()
        loadinventcount()
        loadanonymouscount()
        loadselection()
        startTimer()
        VarianceInfo()
        loadinventorycountbycategory();
        /*if (apiCallFlag == 0) {*/
            loadCategoryInventoryVariance();
        //}

        //loadinvPeriodDD();
        invPeriodsddlHandler('')
        loadItemVarianceByGUIDs();
        filldropdowninventory();
    }
});

function FillGridHandlerAllInvent(response) {
    
    if (response.returnTable[0]["foundInventoryItemsCount"] == null || response.returnTable[0]["foundInventoryItemsCount"] == "0") {
        $("#slab2").text("0");
    } else {
        $("#slab2").text(response.returnTable[0]["foundInventoryItemsCount"])
    }
    if (response.table1[0]["totalItemsCount"] == null || response.table1[0]["totalItemsCount"] == "0") {
        $("#slab1").text("0");
    }
    else {
        $("#slab1").text(response.table1[0]["totalItemsCount"])
    }

    $('#slab3').removeClass('loaderforslabs');
    $("#slab3").text(parseInt($("#slab1").text()) - parseInt($("#slab2").text()));


};

function filldropdowninventory() {
    var loc = $("#invPeriodwiseLocation").val();
    if (loc == null || loc == "0") {
        ddlHandler('');
    }
    else {

        $.ajax({
            url: $('#url_local').val() + "/api/Inventory/GetAllInventoriesByWarehouseGUIDandInventoryPeriod",
            type: 'POST',
            contentType: 'application/json', // Set the content type based on your API requirements
            data: JSON.stringify({
                "warehouseGUID": $("#invPeriodwiseLocation").val(),
                "inventoryPeriodID": $("#invPeriodDD").val()

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

        });
    };
    
};

function filldropdownDivisions() {
    $.ajax({
        url: $('#url_local').val() + "/api/Dashboard/GetItemDivisions",
        type: 'GET',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({ }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            // Handle the successful response
            ddlHandler2(data);
            ddlHandler3("");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }
    });
};

function filldropdownYears() {
    $.ajax({
        url: $('#url_local').val() + "/api/Dashboard/GetYearsforInventoryPeriods",
        type: 'GET',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({}), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            // Handle the successful response
            ddlYearsHandler(data);
            //loadinvPeriodDD(data[0]["inventoryPeriodYears"]);   //first year of entry
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }
    });
};

function ddlHandler(response) {
    fillddls('inventories', 'All Inventories', response)
};

function ddlHandler2(response) {
    fillddls2('divisions', 'All Divisions', response.returnTable)
};

function ddlYearsHandler(response) {
    fillddlYears('yearsDD', 'All Years', response)
};

function ddlHandler3(response) {
    if (response == "") {
        fillddls3('categories', 'All Categories', response)
    }
    else {
        fillddls3('categories', 'All Categories', response.returnTable)
    }
};

$("#inventories").change(function () {
    loadinventcount();
    loadinventselectedcount();
    loadanonymouscount();
    loadItemVarianceByGUIDs();
    loadCategoryInventoryVariance();
    loadinventorycountbycategory();
    VarianceInfo();
});

function fillddls(name, selecttext, data) {
    $("#" + name).empty();
    var s = '<option value="0">' + selecttext + '</option>';
    $.each(data, function (index, item) {
        s += '<option value="' + item.guid + '">' + item.engName + '</option>';

    });
    $("#" + name).html(s);

};

function fillddls2(name, selecttext, data) {
    $("#" + name).empty();
    var s = '<option value="0">' + selecttext + '</option>';
    $.each(data, function (index, item) {
        s += '<option value="' + item.engName + '">' + item.engName + '</option>';
    });
    $("#" + name).html(s);

};

function fillddlYears(name, selecttext, data) {
    $("#" + name).empty();
    var s = '<option value="0">' + selecttext + '</option>';
    $.each(data, function (index, item) {
        s += '<option value="' + item.inventoryPeriodYears + '">' + item.inventoryPeriodYears + '</option>';
    });
    $("#" + name).html(s);

};

function fillddls3(name, selecttext, data) {
    $("#" + name).empty();
    var s = '<option value="0">' + selecttext + '</option>';
    $.each(data, function (index, item) {
        s += '<option value="' + item.engName + '">' + item.engName + '</option>';
    });
    $("#" + name).html(s);
};

function loadinventcount() {
    
    if (($("#inventories option:selected").text() == "All Inventories" || $("#inventories option:selected").text() == "") && ($("#invPeriodwiseLocation option:selected").text() == "All Locations" || $("#invPeriodwiseLocation option:selected").text() == "")) {
      
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
                $('#slab1').removeClass('loaderforslabs');
                $('#slab2').removeClass('loaderforslabs');
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
                "locationGUID": $("#invPeriodwiseLocation").val()

            }), // Adjust the payload format based on your API
            headers: {
                'Authorization': 'Bearer ' + yourToken
            },
            success: function (data) {
                // Handle the successful response
                FillGridHandlerAllInvent(data);
                $('#slab1').removeClass('loaderforslabs');
                $('#slab2').removeClass('loaderforslabs');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle the error
                console.log('AJAX Error: ' + textStatus, errorThrown);
                console.log(jqXHR.responseText); // Log the response for more details
            }

        })
    }
};

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
};

function loadanonymouscount() {
    if ($("#inventories option:selected").text() == "All Inventories" || $("#inventories option:selected").text() == "") {

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
                $('#slab3').removeClass('loaderforslabs');
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
                $('#slab3').removeClass('loaderforslabs');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle the error
                console.log('AJAX Error: ' + textStatus, errorThrown);
                console.log(jqXHR.responseText); // Log the response for more details
            }
        })
    }
};

function FillGridHandlerAllAnonymous(response) {
    //var anonymousItems = response.returnTable[0]["foundAnonymousItems"]
    //if (anonymousItems == null || anonymousItems == "") {
    //    $("#slab3").text("0");
    //}
    //else {
    //    $("#slab3").text(response.returnTable[0]["foundAnonymousItems"]);
    //}
};

function startTimer() {

    timer = setInterval(function () {
        loadinventcount()
        loadanonymouscount()
        loadselection()
        //VarianceInfo()

        //loadinventorycountbycategory()
        //loadCategoryInventoryVariance();

        loadItemVarianceByGUIDs()

    }, 5000);

};

$("#selection").change(function () {
    loadselection()
});

$("#divisions").change(function () {
    $.ajax({
        url: $('#url_local').val() + "/api/Dashboard/GetItemCategoriesAgainstDivision",
        type: 'POST',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({
            "divisionCode": $("#divisions").val(),
        }), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            // Handle the successful response
            ddlHandler3(data);
            loadinventorycountbycategory();
            //loadCategoryInventoryVariance();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }

    })
});

$("#categories").change(function () {
    loadinventorycountbycategory();
    loadCategoryInventoryVariance();
});

function loadinventorycountbycategory() {
    var cat = $("#categories option:selected").text();
    var div = $("#divisions option:selected").text();
    var location = $("#invPeriodwiseLocation option:selected").text();
    var inventory = $("#inventories option:selected").text();
    var qty = $("#varianceBy").val();
    var all = 0;
    if (inventory == "") {
        all = 1;
    }
    else {
        all = 0;
    }

    if ((div == "All Divisions" || div == "" || div == "0")) {
        
    //if ((cat == "All Categories" || cat == "" || cat == "0") || div == "All Divisions" || div == "" || div == "0") {
        $.ajax({
            url: $('#url_local').val() + "/api/Dashboard/GetAllInventoryItemsAgainstCategory",
            type: 'POST',
            contentType: 'application/json', // Set the content type based on your API requirements
            data: JSON.stringify({
                "all" : all,
                "qty": qty,
                "location": location,
                "inventory": inventory
            }), // Adjust the payload format based on your API
            headers: {
                'Authorization': 'Bearer ' + yourToken
            },
            success: function (data) {
                // Handle the successful response
                FillGridHandlerAllCategories(data);
                $('#categorywiseInventory').removeClass('loader');
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
            url: $('#url_local').val() + "/api/Dashboard/GetAllInventoryItemsAgainstCategory",
            type: 'POST',
            contentType: 'application/json', // Set the content type based on your API requirements
            data: JSON.stringify({
                "divisionGUID": div,
                "qty": qty,
                "location": location,
                "inventory": inventory
            }), // Adjust the payload format based on your API
            headers: {
                'Authorization': 'Bearer ' + yourToken
            },
            success: function (data) {
                // Handle the successful response
                FillGridHandlerAllCategories(data);
                $('#categorywiseInventory').removeClass('loader');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle the error
                console.log('AJAX Error: ' + textStatus, errorThrown);
                console.log(jqXHR.responseText); // Log the response for more details
            }

        })
    }
};

function loadCategoryInventoryVariance() {
    
    
    var cat = $("#categories").val();
    if (cat == null || cat == '0') {
        cat = '';
    }
    
    var inv = $("#inventories").val()
    if (inv == null || inv == '0') {
        inv = ''
    };

    var loc = $("#invPeriodwiseLocation").val();
    if (loc == null || loc == '0') {
        loc = ''
    };

    var varianceBy = $("#varianceBy").val();
    
    if (cat == '' && inv == '' && loc == '') {
        
        
        //if (apiCallFlag == 0) {
        //    apiCallFlag = 1;
            $.ajax({
                url: $('#url_local').val() + "/api/Dashboard/GetVarianceAgainstCategoryAndInventory",
                type: 'POST',
                contentType: 'application/json', // Set the content type based on your API requirements
                data: JSON.stringify({
                    "all": 1,
                    "qty": varianceBy
                }), // Adjust the payload format based on your API
                headers: {
                    'Authorization': 'Bearer ' + yourToken
                },
                success: function (data) {
                    // Handle the successful response
                    FillGridCategoryInventoryVariance(data);
                    $('#CategoryInventoryVariance').removeClass('loader');
                    apiCallFlag = 0;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // Handle the error
                    console.log('AJAX Error: ' + textStatus, errorThrown);
                    console.log(jqXHR.responseText); // Log the response for more details
                    apiCallFlag = 0;
                }

            })
        //}
        
    }
    else {
        
        //if (apiCallFlag == 0) {
        //    apiCallFlag = 1;
            $.ajax({
                url: $('#url_local').val() + "/api/Dashboard/GetVarianceAgainstCategoryAndInventory",
                type: 'POST',
                contentType: 'application/json', // Set the content type based on your API requirements
                data: JSON.stringify({
                    "itemCategory": cat,
                    "inventoryGUID": inv,
                    "locationGUID": loc,
                    "qty": varianceBy
                }), // Adjust the payload format based on your API
                headers: {
                    'Authorization': 'Bearer ' + yourToken
                },
                success: function (data) {
                    // Handle the successful response
                    FillGridCategoryInventoryVariance(data);
                    $('#CategoryInventoryVariance').removeClass('loader');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // Handle the error
                    console.log('AJAX Error: ' + textStatus, errorThrown);
                    console.log(jqXHR.responseText); // Log the response for more details
                }

            })
        //}
    }

};

$("#varianceBy").change(function () {
    $("#CategoryInventoryVariance").empty();
    $('#CategoryInventoryVariance').addClass('loader');
    loadItemVarianceByGUIDs();
    loadCategoryInventoryVariance();
    VarianceInfo();
    loadinventorycountbycategory();
});

$("#invPeriodwiseLocation").change(function () {
    loadinventcount();
    loadItemVarianceByGUIDs();
    filldropdowninventory();
    loadCategoryInventoryVariance();
    loadinventorycountbycategory();
    VarianceInfo();
})

function loadItemVarianceByGUIDs() {
    
    var varianceBy = $("#varianceBy option:selected").val();

    var locationDD = $("#invPeriodwiseLocation").val();
    var inventoryDD = $("#inventories").val();

    if (varianceBy == "Price") {
        $("#wiseVariance").text("Price-wise Variance:");
    }
    else {
        $("#wiseVariance").text("Item-wise Variance:");
    }
    
    /*if ($("#inventories option:selected").text() == "All Inventories" || $("#inventories option:selected").text() == "" || $("#inventories option:selected").text() == "0") {*/
    if (($("#invPeriodwiseLocation option:selected").text() == "All Locations" || $("#invPeriodwiseLocation option:selected").text() == "" || $("#invPeriodwiseLocation option:selected").text() == "0") && ($("#inventories option:selected").text() == "All Inventories" || $("#inventories option:selected").text() == "" || $("#inventories option:selected").text() == "0")) {

        $.ajax({
            url: $('#url_local').val() + "/api/Dashboard/GetItemVarianceAgainstInventory",
            type: 'POST',
            contentType: 'application/json', // Set the content type based on your API requirements
            data: JSON.stringify({
                "all": 1,
                "showScannedItemsCheckboxVal" : showScannedItemsCheckboxVal,
                "qty": varianceBy,
            }), // Adjust the payload format based on your API
            headers: {
                'Authorization': 'Bearer ' + yourToken
            },
            success: function (data) {
                
                // Handle the successful response
                FillGridItemVariance(data);
                $('#itemsVariance').removeClass('loader');
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
            url: $('#url_local').val() + "/api/Dashboard/GetItemVarianceAgainstInventory",
            type: 'POST',
            contentType: 'application/json', // Set the content type based on your API requirements
            data: JSON.stringify({
                "locationGUID": locationDD,
                "inventoryGUID": inventoryDD,
                "showScannedItemsCheckboxVal": showScannedItemsCheckboxVal,
                "qty": varianceBy,
            }), // Adjust the payload format based on your API
            headers: {
                'Authorization': 'Bearer ' + yourToken
            },
            success: function (data) {
                // Handle the successful response
                FillGridItemVariance(data);
                $('#itemsVariance').removeClass('loader');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle the error
                console.log('AJAX Error: ' + textStatus, errorThrown);
                console.log(jqXHR.responseText); // Log the response for more details
            }

        })
    }
};

$("#showScannedItemsCheckbox").change(function () {
    var checkbox = document.getElementById('showScannedItemsCheckbox');
    showScannedItemsCheckboxVal = checkbox.checked ? 1 : 0;
    $("#itemsVariance").empty();
    $("#itemsVariance").addClass("loader");
    loadItemVarianceByGUIDs();
});

function FillGridHandlerAllCategories(response) {
    
    $("#categorywiseInventory").empty();
    if (response.returnTable.length == 0) {
        $('#categorywiseInventory').append('<tr><td><div class="d-flex align-items-center fw-medium"></div></td><td>No Data Found</td><td></td></tr>');
    }
    else {
        for (i = 0; i < response.returnTable.length; i++) {
            
            $('#categorywiseInventory').append('<tr><td><div class="d-flex align-items-center fw-medium">' + response.returnTable[i].location + '</div></td><td>' + response.returnTable[i].division + '</td><td>' + parseFloat(response.returnTable[i].systemData).toFixed(2) + '</td><td>' + parseFloat(response.returnTable[i].physicalData).toFixed(2) + '</td><td>' + parseFloat(response.returnTable[i].physicalData - response.returnTable[i].systemData).toFixed(2) + '</td></tr>');
        }
    }
    
};

function FillGridItemVariance(response) {

    $("#itemsVariance").empty();
    if (response.returnTable.length == 0) {
        $('#itemsVariance').append('<tr><td><div class="d-flex align-items-center fw-medium"></div></td><td>No Data Found</td><td></td></tr>');
    }
    else {
        for (i = 0; i < response.returnTable.length; i++) {
            $('#itemsVariance').append('<tr><td><div style="font-size: 12px;" class="d-flex align-items-center fw-medium">' + response.returnTable[i].description + '</div></td><td style="padding-right: 8px;">' + parseFloat(response.returnTable[i].systemData).toFixed(2) + '</td><td style="padding-right: 20px;">' + parseFloat(response.returnTable[i].physicalData).toFixed(2) + '</td><td>' + parseFloat(response.returnTable[i].varianceData).toFixed(2) + '</td></tr>');
        }
    }

};

function FillGridCategoryInventoryVariance(response) {
    
    $("#CategoryInventoryVariance").empty();
    if (response.returnTable.length == 0) {
        $('#CategoryInventoryVariance').append('<tr><td><div class="d-flex align-items-center fw-medium"></div></td><td>No Data Found</td><td></td></tr>');
    }
    else {
        for (i = 0; i < response.returnTable.length; i++) {
            $('#CategoryInventoryVariance').append('<tr><td><div class="d-flex align-items-center fw-medium"><i class="ri-map-pin-line fs-15 lh-1 me-1"></i>' + response.returnTable[i].location + '</div></td><td>' + response.returnTable[i].category + '</td><td>' + parseFloat(response.returnTable[i].systemData).toFixed(2) + '</td><td>' + parseFloat(response.returnTable[i].physicalData).toFixed(2) + '</td><td>' + parseFloat(response.returnTable[i].varianceData).toFixed(2) + '</td></tr>');
        }
    }
};

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
                $("#mylist").removeClass('loader');
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

};

function FillGridHandlerSelection(response) {
    $("#selectionName").text("Inventory Name");
    var selectionText = $("#myselect").text();
    if (selectionText == "Anonymous Items found by Devices") {
        $("#selectionName").text("Device Name")
    };
    $('#mylist').empty();
    for (i = 0; i < response.returnTable.length; i++) {
        $('#mylist').append("<tr><td><span class='badge-dot bg-twitter me-2'></span> <span class='fw-medium'>" + response.returnTable[i].itemName + "</span></td><td>" + response.returnTable[i].name + "</td><td>" + response.returnTable[i].barcode + "</td><td>" + parseFloat(response.returnTable[i].itemQty).toFixed(2) +"</td></tr>");
    }        
};

function VarianceInfo() {

    var qty = $("#varianceBy").val();
    var loc = $("#invPeriodwiseLocation").val();

    if (loc == "All Locations" || loc == "" || loc == "0" || loc == null) {
        $.ajax({
            url: $('#url_local').val() + "/api/Dashboard/GetVarianceInfo",
            type: 'POST',
            contentType: 'application/json', // Set the content type based on your API requirements
            data: JSON.stringify({
                "all": 1,
                "qty": qty
            }), // Adjust the payload format based on your API
            headers: {
                'Authorization': 'Bearer ' + yourToken
            },
            success: function (data) {
                // Handle the successful response
                divFunction(data)
                $('#progressBarDiv').removeClass('loader');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle the error
                console.log('AJAX Error: ' + textStatus, errorThrown);
                console.log(jqXHR.responseText); // Log the response for more details
            }

        });
    }
    else {
        $.ajax({
            url: $('#url_local').val() + "/api/Dashboard/GetVarianceInfo",
            type: 'POST',
            contentType: 'application/json', // Set the content type based on your API requirements
            data: JSON.stringify({
                "locationGUID": loc,
                "qty": qty
            }), // Adjust the payload format based on your API
            headers: {
                'Authorization': 'Bearer ' + yourToken
            },
            success: function (data) {
                // Handle the successful response
                divFunction(data)
                $('#progressBarDiv').removeClass('loader');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle the error
                console.log('AJAX Error: ' + textStatus, errorThrown);
                console.log(jqXHR.responseText); // Log the response for more details
            }
        });
    }

};

function divFunction(data) {
    $('#performanceTable').empty();
    $('#progressBarDiv').empty();
    var countArray = [];
    var color = '';
    var colorArray = ['primary', 'success', 'orange', 'pink', 'info', 'indigo'];
    var responseCount = 0;

    for (var i = 0; i < data.returnTable.length; i++) {
        responseCount = responseCount + data.returnTable[i]["totalItemsData"];
    }
    for (var j = 0; j < data.returnTable.length; j++) {
        countArray[j] = (data.returnTable[j]["totalItemsData"] / responseCount) * 100;
        countArray[j] = Math.round(countArray[j] / 5) * 5;
        color = colorArray[j]
        $("#progressBarDiv").append('<div class="progress-bar bg-' + color + ' w-' + countArray[j].toLocaleString() + '" role="progressbar" aria-valuenow="' + countArray[j].toLocaleString() + '" aria-valuemin="0" aria-valuemax="100"></div>')
        $("#performanceTable").append('<tbody><tr><td><div class="badge-dot bg-' + color + '"></div></td><td>' + data.returnTable[j]["name"] + '</td><td>' + data.returnTable[j]["totalItemsData"].toLocaleString() + '</td><td>' + data.returnTable[j]["count"].toLocaleString() + '</td></tr></tbody>');
    }    
   
};

//region "Refresh Buttons are here"

$("#itemWiseVarianceRefreshButton").click(function () {
    $("#itemsVariance").empty();
    $("#itemsVariance").addClass("loader");
    loadItemVarianceByGUIDs();
});

$("#CategoryOrInventoryRefreshButton").click(function () {
    
    $("#CategoryInventoryVariance").empty();
    $("#CategoryInventoryVariance").addClass("loader");
    loadCategoryInventoryVariance()
});

$("#categorywiseInventoryRefreshButton").click(function () {
    $("#categorywiseInventory").empty();
    $("#categorywiseInventory").addClass("loader");
    loadinventorycountbycategory();
});

$("#InvOrDeviceWiseRefreshButton").click(function () {
    $("#mylist").empty();
    $("#mylist").addClass("loader");
    loadselection();
});

$("#analyticPerformanceRefreshButton").click(function () {
    $('#performanceTable').empty();
    $('#progressBarDiv').empty();
    $('#progressBarDiv').addClass("loader");
    VarianceInfo()
});

$("#yearsDD").change(function () {
    loadinvPeriodDD($("#yearsDD").val())
})
function loadinvPeriodDD(year) {
    
    $.ajax({
        url: $('#url_local').val() + "/api/Dashboard/GetInventoryPeriodsAgainstYear",
        type: 'POST',
        contentType: 'application/json', // This tells the server to expect JSON data
        data: JSON.stringify({ year: year }), // Wrap the year in an object
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            // Handle the successful response
            invPeriodsddlHandler(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }
    });
}

function invPeriodsddlHandler(response) {
    fillinvPeriodsddls('invPeriodDD','All Inventory Periods', response)
};

function fillinvPeriodsddls(name, selecttext, data) {
    
    $("#" + name).empty();
    var s = '<option value="0">' + selecttext + '</option>';
    $.each(data, function (index, item) {
        s += '<option value="' + item.id + '">' + item.value + '</option>';
    });
    $("#" + name).html(s);
    invPeriodDDCheck();
};

function invPeriodDDCheck() {
    var selectedInvPeriod = $("#invPeriodDD").val();

    if (selectedInvPeriod == null) {
        loadWarehouseDDL('');
    }
    else {
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
    }
};

$("#invPeriodDD").change(function () {
    var selectedInvPeriod = $("#invPeriodDD").val();

    if (selectedInvPeriod == null) {
        loadWarehouseDDL('');
    }
    else {
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
    }
});

function loadWarehouseDDL(response) {
    fillddWarehouse('invPeriodwiseLocation', 'All Locations', response)
};

function fillddWarehouse(name, selecttext, data) {
    $("#" + name).empty();
    var s = '<option value="0">' + selecttext + '</option>';
    $.each(data, function (index, item) {
        s += '<option value="' + item.guid + '">' + item.location + '</option>';
    });
    $("#" + name).html(s);
    loadItemVarianceByGUIDs();
};

//endregion