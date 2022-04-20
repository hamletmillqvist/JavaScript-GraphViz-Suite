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

    const config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Total Profit / Row',
                    data: data,
                },
            ]
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

    var options = {
          series: [{
            name: "Desktops",
            data: data,
        }],
          chart: {
          height: getHeight(),
          width: getWidth(), // not tested
          type: 'line',
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        title: {
          text: 'Total Profit / Row',
          align: 'left'
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
    const div = document.getElementById('chart');
    const data = getLineData();
    const labels = generateLabels();

    timer.start();
    bb.generate({
        data: {
            x: "Index",
            columns: [
                ["Index"].concat(labels),
                ["Profit"].concat(data),
            ],
            type: "line",
            //colors: {
            //    Men: "rgba(0,143,251)",
            //    Women: "rgba(0,227,150)",
            //},
        },
        bindto: '#chart',
    });
    timer.stop();
    timer.print();
    timer.write();
};

makeChart.toastUI = () => {
    const el = document.getElementById('chart'); // MUST BE NAMED 'el'
    const data = {
        categories: generateLabels(),
        series: [
            {
                name: 'Profit',
                data: getLineData(),
            },
        ],
    };

    const options = {
        chart: { title: 'Total Profit / Row', width: getWidth(), height: getHeight() },
        xAxis: {
            title: 'Index',
        },
        yAxis: {
            title: 'Profit',
        },
    };

    timer.start();
    const chart = toastui.Chart.lineChart({ el, data, options });
    timer.stop();
    timer.print();
    timer.write();
};

makeChart.chartist = () => {
    var data = {
        labels: generateLabels(),
        series: [ getLineData() ],
    }

    var options = {
        width: getWidth(),
        height: getHeight(),
        showPoint: true,
        lineSmooth: false,
    };

    timer.start();
    new Chartist.Line('#chart', data, options);
    timer.stop();
    timer.print();
    timer.write();
}
