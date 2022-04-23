itemCount = 10;

function extractYear(date) {
    const arr = date.split('/');
    return arr[arr.length - 1];
}

function getLineData() {
    var data = [];

    if (itemCount == 0) {
        itemCount = dataset.length;
    }

    for (let i = 0; i < itemCount; i++) {
        data.push(dataset[i]['Total Profit'])
    }

    return data;
}

function generateLabels() {
    var labels = [];
    for (let i = 0; i < itemCount; i++) {
        labels.push(String(i));
    }
    return labels;
}

makeChart.chartjs = () => {
    const div = document.getElementById('chart');
    const data = getLineData();
    const labels = generateLabels();
    const color = getColor();

    const config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Profit',
                data: data,
                backgroundColor: color,
                borderColor: color,

            }, ]
        },
        options: {
            elements: {
                point: {
                    radius: 0 // hide data points as the other does not use it per default
                }
            },
            responsive: false,
            maintainAspectRatio: true,
            aspectRatio: 1,
        },
    };

    timer.start();
    new Chart(div, config); // ASSEMBLING AND RENDERING
    timer.stop();
    timer.print();
    timer.write();
};

makeChart.apexCharts = () => {
    const data = getLineData();
    const labels = generateLabels();
    const color = getColor();

    var options = {
        series: [{
            name: "Desktops",
            data: data,
        }],
        chart: {
            height: getHeight(),
            width: getWidth(),
            type: 'line',
        },
        dataLabels: {
            enabled: false
        },
        colors: [color],
        stroke: {
            colors: [color],
            curve: 'straight',
        },
        title: {
            text: 'Total Profit',
            align: 'center'
        },
        xaxis: {
            categories: labels,
        }
    };

    timer.start();
    var chart = new ApexCharts(document.querySelector("#chart"), options);
    timer.tick();
    chart.render();
    timer.stop();
    timer.print();
    timer.write();
};

makeChart.billboard = () => {
    const data = getLineData();
    const labels = generateLabels();
    const config = {
        data: {
            x: "Index",
            columns: [
                ["Index"].concat(labels),
                ["Profit"].concat(data),
            ],
            type: "line",
            colors: {
                Profit: getColor(),
            },
        },
        bindto: '#chart',
        axis: {
            x: {
                tick: {
                    culling: false
                }
            }
        },
        legend: {
            show: false,
        },
        title: {
            text: 'Total Profit',
            position: 'center',
        },
        point: {
            show: false,
        }
    };

    timer.start();
    bb.generate(config);
    timer.stop();
    timer.print();
    timer.write();
};

makeChart.toastUI = () => {
    const el = document.getElementById('chart'); // MUST BE NAMED 'el'
    const data = {
        categories: generateLabels(),
        series: [{
            name: 'Profit',
            data: getLineData(),
        }, ],
    };

    const options = {
        chart: {
            title: 'Total Profit',
            width: getWidth(),
            height: getHeight()
        },
        legend: {
            visible: false,
        },
        theme: {
            series: {
                colors: [getColor()],
            },
        },
    };

    timer.start();
    const chart = toastui.Chart.lineChart({
        el,
        data,
        options
    });
    timer.stop();
    timer.print();
    timer.write();
};

makeChart.chartist = () => {
    var data = {
        labels: generateLabels(),
        series: [getLineData()],
    }

    var options = {
        width: getWidth(),
        height: getHeight(),
        showPoint: false,
        lineSmooth: false,
    };

    timer.start();
    new Chartist.Line('#chart', data, options);
    timer.stop();
    timer.print();
    timer.write();
}
