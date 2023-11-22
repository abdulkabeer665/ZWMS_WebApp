var yourToken = sessionStorage.getItem('yourToken')

$(window).on('load', function () {

    varianceChart();

});

function varianceChart() {

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
            responseFunction(data)
            //$('#progressBarDiv').removeClass('loader');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }

    })

    //$.ajax({
    //    url: $('#url_local').val() + "/api/Dashboard/GetAllInventoryItemsCountAgainstInventoryOrDevice",
    //    type: 'POST',
    //    contentType: 'application/json', // Set the content type based on your API requirements
    //    data: JSON.stringify({
    //        "Inventory": 1,


    //    }), // Adjust the payload format based on your API
    //    headers: {
    //        'Authorization': 'Bearer ' + yourToken
    //    },
    //    success: function (data) {
    //        // Handle the successful response
    //        //responseFunction(data);
    //    },
    //    error: function (jqXHR, textStatus, errorThrown) {
    //        // Handle the error
    //        console.log('AJAX Error: ' + textStatus, errorThrown);
    //        console.log(jqXHR.responseText); // Log the response for more details
    //    }

    //});
};

function responseFunction(response) {
    console.log(response);

    var chartColor = [];
    var chartLabel = [];
    var chartCount = [];

    for (var i = 0; i < response.returnTable.length; i++) {
        
        chartCount[i] = response.returnTable[i]["count"];
        chartLabel[i] = response.returnTable[i]["name"];
        if (chartCount[i] < 20) {
            chartColor[i] = "#5cb85c"
        }
        if (chartCount[i] >= 20 && chartCount[i] < 50) {
            chartColor[i] = "#f0ad4e"
        }
        if (chartCount[i] >= 50 && chartCount[i] <= 100) {
            chartColor[i] = "#d9534f"
        }
    };

    'use strict'

    // Current Ticket Status
    var ctx1 = document.getElementById('chartJS1').getContext('2d');
    var chart1 = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: chartLabel,
            //labels: ['Invent1', 'Invent2', 'Invent3', 'Invent4', 'Invent5', 'Invent6', 'Invent7', 'Invent8', 'Invent9', 'Invent10', 'Invent1', 'Invent2', 'Invent3', 'Invent4', 'Invent4'],
            datasets: [{
                data: chartCount,
                backgroundColor: chartColor,
                barPercentage: 0.3
                //}, {
                //    data: [10, 40, 30, 40, 60, 55, 45, 35, 30, 20],
                //    backgroundColor: '#85b6ff',
                //    barPercentage: 0.5
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
                            debugger
                            console.log(chartCount)
                            var rrr = [];
                            rrr = chartCount;
                            //console.log(tooltipItem)
                            //console.log(tooltipItem.raw)
                            //console.log(tooltipItem.label)
                            //console.log(tooltipItem.dataset.data)

                            //var datasetIndex = tooltipItem.dataIndex;
                            //var index = tooltipItem.index;

                            //// Get the corresponding value from the array
                            //var tooltipValue = data.datasets[datasetIndex].data[index];

                            // Customize tooltip label content here
                            return ["Hello"];
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
}