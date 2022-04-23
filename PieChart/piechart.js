seriesCount = 10000;

function getPieData() {
    var data = [];

    if (seriesCount == 0) {
        seriesCount = dataset.length;
    }

    for (let i = 0; i < seriesCount; i++) {
        data.push(dataset[i]['Units Sold'])
    }

    return data;
}

makeChart.chartjs = () => {
    const canvas = document.getElementById('chart');
    const config = {
        type: 'pie',
        data: {
            datasets: [{
                data: getPieData(dataset),
                hoverOffset: 4,
                backgroundColor: makeColorArray(seriesCount),
                borderColor: "transparent",
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
        },
    };
    const options = {
        animations: false
    };

    timer.start();
    new Chart(canvas, config, options); // ASSEMBLING AND RENDERING
    timer.stop();
    timer.print();
    timer.write();
}

makeChart.apexCharts = () => {
    const div = document.getElementById('chart');
    const options = {
        chart: {
            type: 'pie',
            width: getWidth(),
            height: getHeight(),
        },
        series: getPieData(dataset),
        colors: makeColorArray(seriesCount),
        stroke: {
            colors: ['transparent']
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false
        },
    }

    timer.start();
    const chart = new ApexCharts(div, options); // ASSEMBLING
    timer.tick();
    chart.render(); // RENDERING
    timer.stop();
    timer.print();
    timer.write();
}

makeChart.billboard = () => {
    const data = getPieData(dataset);
    let series = [];
    let colors = {};

    for (let i = 0; i < data.length; i++) {
        let indexString = String(i); // instead of 2 conversions
        let serie = [indexString, data[i]];
        series.push(serie);

        colors[indexString] = getColor();
    }

    const config = {
        data: {
            columns: series,
            type: "pie",
            colors: colors,
        },
        bindto: '#chart',
        legend: {
            show: false,
        },
        pie: {
            label: {
                show: false,
            }
        }
    };

    timer.start();
    bb.generate(config);
    timer.stop();
    timer.print();
    timer.write();
}

makeChart.toastUI = () => {
    const div = document.getElementById('chart');
    const data = getPieData(dataset);
    series = [];
    for (let i = 0; i < data.length; i++) {
        serie = {
            name: String(i),
            data: data[i],
        };
        series.push(serie);
    }

    timer.start();
    toastui.Chart.pieChart({
        el: div,
        data: {
            categories: ['Review'],
            series: series,
        },
        options: {
            chart: {
                width: getWidth(),
                height: getHeight(),
            },
            series: {

            },
            legend: {
                visible: false,
            },
            theme: {
                series: {
                    colors: makeColorArray(seriesCount),
                }
            }
        },
    });
    timer.stop();
    timer.print();
    timer.write();
}

makeChart.chartist = () => {
    const pieData = getPieData();
    let series = [];

    function colorName(hex) {
        switch (hex.toLowerCase()) {
            case "#ff0000":
                return "red"

            case "#00ff00":
                return "green";

            case "#0000ff":
                return "blue";

            default:
                return "gray";
        }
    }

    pieData.forEach(element => {
        let serie = {};
        serie['value'] = element;
        serie['className'] = colorName(getColor());
        series.push(serie);
    });

    var data = {
        series: series,
    };
    const options = {
        width: getWidth(),
        height: getHeight(),
        showLabel: false,
    };

    timer.stop();
    timer.print();
    timer.start();
    new Chartist.Pie('#chart', data, options);
    timer.stop();
    timer.print();
    timer.write();
}
