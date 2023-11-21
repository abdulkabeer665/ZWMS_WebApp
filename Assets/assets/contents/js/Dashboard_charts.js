var yourToken = sessionStorage.getItem('yourToken')

$(window).on('load', function () {

    varianceChart();

});

function varianceChart() {

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
            responseFunction(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error
            console.log('AJAX Error: ' + textStatus, errorThrown);
            console.log(jqXHR.responseText); // Log the response for more details
        }

    });
};

function responseFunction(response) {
    console.log("==================")
    console.log(response);
    var data = [10, 60, 50, 45, 50, 60, 70, 40, 45, 35, 10, 60, 50, 45, 45];
    var colour = []
    var resLabels = [];
    var resCounts = [];

    for (var i = 0; i < 10; i++) {
        if (data[i] < 20) {
            colour[i] = "#5cb85c"
        }
        if (data[i] >= 20 && data[i] < 50) {
            colour[i] = "#f0ad4e"
        }
        if (data[i] >= 50 && data[i] <= 100) {
            colour[i] = "#d9534f"
        }

    };

    for (var i = 0; i < response.returnTable.length; i++) {
        resLabels[i] = response.returnTable[i]["name"];
        resCounts[i] = response.returnTable[i]["count"];
    }

    'use strict'



    // Current Ticket Status
    var ctx1 = document.getElementById('chartJS1').getContext('2d');
    var chart1 = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: resLabels,
            //labels: ['Invent1', 'Invent2', 'Invent3', 'Invent4', 'Invent5', 'Invent6', 'Invent7', 'Invent8', 'Invent9', 'Invent10', 'Invent1', 'Invent2', 'Invent3', 'Invent4', 'Invent4'],
            datasets: [{
                data: resCounts,
                backgroundColor: colour,
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
                            var rrr = [];
                            var sss = [];
                            rrr = resCounts
                            var shom = rrr.splice(",")
                            console.log(shom);
                            for (var i = 0; i < shom.length; i++) {
                                sss[i] = "Hello" + shom[i]
                                console.log(sss)
                            }
                            // Customize tooltip label content here
                            return ["Hello", "Hello"];
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