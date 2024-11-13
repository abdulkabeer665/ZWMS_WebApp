var yourToken = sessionStorage.getItem('yourToken')

$(window).on('load', function () {
    varianceChart();
    itemvarianceChart();
});

var name = []
var totalcount = []
var count = []
var variance = []
var varianceadjustment = []
var varianceadjustmenttext = []
var chartColor = [];
var chartLabel = [];
var chartCount = [];

$("#invPeriodwiseLocation").change(function () {
    name = []
    totalcount = []
    count = []
    variance = []
    varianceadjustment = []
    varianceadjustmenttext = []
    chartColor = [];
    chartLabel = [];
    chartCount = [];
    varianceAPI();
    itemvarianceAPI();
});

function varianceChart() {
   varianceAPI()
};

function itemvarianceChart() {
    itemvarianceAPI()
};

function varianceAPI() {
    var locationGUID = $("#invPeriodwiseLocation").val();
    var varianceBy = $("#varianceBy").val();
    if (locationGUID == null | locationGUID == "0") {
        //location
        $.ajax({
            url: $('#url_local').val() + "/api/Dashboard/GetVarianceInfo",
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
                responseFunction(data)
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
            url: $('#url_local').val() + "/api/Dashboard/GetVarianceInfo",
            type: 'POST',
            contentType: 'application/json', // Set the content type based on your API requirements
            data: JSON.stringify({
                "locationGUID": locationGUID,
                "qty": varianceBy
            }), // Adjust the payload format based on your API
            headers: {
                'Authorization': 'Bearer ' + yourToken
            },
            success: function (data) {
                // Handle the successful response
                responseFunction(data)
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle the error
                console.log('AJAX Error: ' + textStatus, errorThrown);
                console.log(jqXHR.responseText); // Log the response for more details
            }

        })
    }
};

function itemvarianceAPI() {
    $.ajax({
        url: $('#url_local').val() + "/api/Dashboard/GetAllInventoryItemsForCategoryBarChart",
        type: 'GET',
        contentType: 'application/json', // Set the content type based on your API requirements
        data: JSON.stringify({}), // Adjust the payload format based on your API
        headers: {
            'Authorization': 'Bearer ' + yourToken
        },
        success: function (data) {
            // Handle the successful response
            responseFunction2(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }

    })

};

function responseFunction(response) {

    if ($("#varianceBy option:selected").text() == "By Quantity") {
        for (var i = 0; i < response.returnTable.length; i++) {
            var test = response.returnTable[0]["name"]
            name[i] = response.returnTable[i]["name"];
            totalcount[i] = response.returnTable[i]["totalItemsData"];
            count[i] = response.returnTable[i]["count"];
            variance[i] = ((count[i] - totalcount[i]) / totalcount[i]) * 100
            varianceadjustment[i] = variance[i]
            varianceadjustment[i] = parseFloat(varianceadjustment[i].toFixed(2));
            if (variance[i].toString().includes('-')) {
                varianceadjustmenttext[i] = "Negative Adjustment"
            }
            else {
                varianceadjustmenttext[i] = "Positive Adjustment"
            }

            variance[i] = Math.abs(variance[i])

        }
    }
    else {
        for (var i = 0; i < response.returnTable.length; i++) {
            name[i] = response.returnTable[i]["name"];
            totalcount[i] = response.returnTable[i]["totalItemsData"];
            count[i] = response.returnTable[i]["count"];
            variance[i] = ((count[i] - totalcount[i]) / totalcount[i]) * 100
            varianceadjustment[i] = variance[i]
            varianceadjustment[i] = parseFloat(varianceadjustment[i].toFixed(2));
            if (variance[i].toString().includes('-')) {
                varianceadjustmenttext[i] = "Negative Adjustment"
            }
            else {
                varianceadjustmenttext[i] = "Positive Adjustment"
            }

            variance[i] = Math.abs(variance[i])

        }
    }
 
    for (var i = 0; i < variance.length; i++) {

        chartCount[i] = variance[i];
        chartLabel[i] = response.returnTable[i]["name"];
        if (chartCount[i] < 20) {
            chartColor[i] = "#5cb85c"
        }
        if (chartCount[i] >= 20 && chartCount[i] < 50) {
            chartColor[i] = "#f0ad4e"
        }
        if (chartCount[i] >= 50) {
            chartColor[i] = "#d9534f"
        }
    };

   createChart()
};

var iname = []
var itotalcount = []
var icount = []
var ivariance = []
var ivarianceadjustment = []
var ivarianceadjustmenttext = []
var ichartColor = [];
var ichartLabel = [];
var ichartCount = [];
var iSystemQty = [];
var iPhysicalQty = [];
var imaxSystemQty;
var imaxPhysicalQty;
var imaxOverallQty;
var imaxWithBuffer;

function responseFunction2(response) {
    for (var i = 0; i < response.returnTable.length; i++) {

        iname[i] = response.returnTable[i]["iC_EngName"];
        itotalcount[i] = response.returnTable[i]["iskU_ItemsAgainstCategory"];  //SystemQty
        icount[i] = response.returnTable[i]["iI_FoundItemsAgainstCategory"];    //PhysicalQty
        ivariance[i] = response.returnTable[i]["variance"]; //Variance
        ivarianceadjustment[i] = ivariance[i]
        ivarianceadjustment[i] = parseFloat(ivarianceadjustment[i].toFixed(2));
        if (ivariance[i].toString().includes('-')) {
            ivarianceadjustmenttext[i] = "Negative Adjustment"
        }
        else {
            ivarianceadjustmenttext[i] = "Positive Adjustment"
        }
        ivariance[i] = Math.abs(ivariance[i])
    }

    for (var i = 0; i < ivariance.length; i++) {

        //for (var i = 0; i < ivariance.length-1; i++) {
        iSystemQty[i] = itotalcount[i];
        iPhysicalQty[i] = icount[i];
        //ichartCount[i] = ivariance[i];

        ichartLabel[i] = response.returnTable[i]["iC_EngName"]
        if (iPhysicalQty[i] < 20) {
            ichartColor[i] = "#5cb85c"
        }
        if (iPhysicalQty[i] >= 20 && iPhysicalQty[i] < 50) {
            ichartColor[i] = "#f0ad4e"
        }
        if (iPhysicalQty[i] >= 50) {
            ichartColor[i] = "#d9534f"
        }
    };
    imaxSystemQty = Math.max(...iSystemQty);
    imaxPhysicalQty = Math.max(...iPhysicalQty);

    imaxOverallQty = Math.max(imaxSystemQty, imaxPhysicalQty);
    
    // Add a buffer to the maximum value
    var bufferPercentage = 0.2; // 10% buffer
    imaxWithBuffer = Math.round(imaxOverallQty * (1 + bufferPercentage));

    createChart2()
};

var chart1 = null
var chart2 = null

function createChart() {
    'use strict'

    // Current Ticket Status
    var ctx1 = document.getElementById('chartJS1').getContext('2d');
    if (chart1 !== null) {

        chart1.destroy(); // Destroy the existing chart
    }

    chart1 = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: chartLabel,
            anotherLabels: variance,
            datasets: [{
                data: chartCount,
                backgroundColor: chartColor,

                barPercentage: 0.3
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true, // Show tooltips on hover
                    mode: 'index', // Display multiple tooltips if the point overlaps
                    intersect: false, // Allow tooltip to display even if not directly over the point
                    callbacks: {
                        label: function (tooltipItem, data) {
                            var rrr = [];
                            rrr = chartCount;
                            var datasetIndex = tooltipItem.dataIndex;
                            var index = tooltipItem.index;
                            var varianceData = varianceadjustment[tooltipItem.dataIndex];
                            var varianceText = varianceadjustmenttext[tooltipItem.dataIndex];
                            var TotalCount = totalcount[tooltipItem.dataIndex];
                            var Count = count[tooltipItem.dataIndex];
                            var datasetIndex = tooltipItem.dataIndex;
                            if ($("#varianceBy option:selected").text() == "By Quantity") {
                                return [varianceText, 'Variance: ' + varianceData + '%', 'Total Items: ' + TotalCount, 'Found Items: ' + Count];
                            }
                            else {
                                return [varianceText, 'Variance: ' + varianceData + '%', 'Total Items Price: ' + TotalCount, 'Found Items Price: ' + Count];

                            }
                        }

                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#a1aab3',
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        borderColor: '#e2e5ec',
                        borderWidth: 1.5,
                        color: 'rgba(65,80,95,.08)'
                    }
                },
                x: {
                    ticks: {
                        color: '#313c47'
                    },
                    grid: {
                        color: 'rgba(65,80,95,.08)'
                    }
                }
            }
        }


    });
    return chart1;
};

function createChart2() {
    'use strict'
    
    // Current Ticket Status
    var ctx1 = document.getElementById('chartJS2').getContext('2d');
    if (chart2 !== null) {
    
        chart2.destroy(); // Destroy the existing chart
    }
    
    chart2 = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ichartLabel,
            anotherLabels: ivariance,
            datasets: [{    
                data: iSystemQty,  //SystemQty Bar
                //backgroundColor: ichartColor,
                backgroundColor: 'green',
                barPercentage: 0.3
            },
            {
                data: iPhysicalQty,  //PhysicalQty Bar
                backgroundColor: ichartColor,
                barPercentage: 0.3
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true, // Show tooltips on hover
                    mode: 'index', // Display multiple tooltips if the point overlaps
                    intersect: false, // Allow tooltip to display even if not directly over the point
                    callbacks: {
                        label: function (tooltipItem, data) {
                            console.log(tooltipItem)
                            var rrr = [];
                            //rrr = iPhysicalQty;
                            //rrr = ichartCount;
    
                            //var datasetIndex = tooltipItem.dataIndex;
                            //var index = tooltipItem.index;
                            //var varianceData = ivarianceadjustment[tooltipItem.dataIndex];
                            //var varianceText = ivarianceadjustmenttext[tooltipItem.dataIndex];
                            var TotalCount = itotalcount[tooltipItem.dataIndex];    //SystemQty
                            var Count = iPhysicalQty[tooltipItem.dataIndex];
                            //var datasetIndex = tooltipItem.dataIndex;
                          
                            return ['Book Stock Category: ' + TotalCount, 'Found Book BookCategory: ' + Count];
                            //return [varianceText, 'Variance: ' + varianceData + '%', 'Items Against Category: ' + TotalCount, 'Found Items Against Category: ' + Count];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: imaxWithBuffer,
                    //max: 100,
                    ticks: {
                        color: '#a1aab3',
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        borderColor: '#e2e5ec',
                        borderWidth: 1.5,
                        color: 'rgba(65,80,95,.08)'
                    }
                },
                x: {
                    ticks: {
                        //color: '#313c47'
                        color: '#a1aab3'
                    },
                    grid: {
                        color: 'rgba(65,80,95,.08)'
                    }
                }
            }
        }
    });
    return chart2;
};

$("#varianceBy").change(function () {
   name = [];
   totalcount = [];
   count = [];
   variance = [];
   varianceadjustment = [];
   varianceadjustmenttext = [];
   chartColor = [];
   chartLabel = [];
   chartCount = [];  
   iname = [];
   itotalcount = [];
   icount = [];
   ivariance = [];
   ivarianceadjustment = [];
   ivarianceadjustmenttext = [];
   ichartColor = [];
   ichartLabel = [];
   ichartCount = [];
   iSystemQty = [];
   iPhysicalQty = [];
   varianceAPI();
   itemvarianceAPI();
});

$("#chartJS1RefreshButton").click(function () {
    name = [];
    totalcount = [];
    count = [];
    variance = [];
    varianceadjustment = [];
    varianceadjustmenttext = [];
    chartColor = [];
    chartLabel = [];
    chartCount = [];
    varianceAPI();
});

$("#chartJS2RefreshButton").click(function () {
    iname = []
    itotalcount = []
    icount = []
    ivariance = []
    ivarianceadjustment = []
    ivarianceadjustmenttext = []
    ichartColor = [];
    ichartLabel = [];
    ichartCount = [];
    iSystemQty = [];
    iPhysicalQty = [];
    imaxSystemQty;
    imaxPhysicalQty;
    imaxOverallQty;
    imaxWithBuffer;
    itemvarianceAPI();
});