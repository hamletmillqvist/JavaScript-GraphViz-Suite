timer = {
	timeStamp_start: 0,
	timeStamp_stop: 0,
    timeStamp_tick: 0,
	
	start: function ()  { this.timeStamp_start = performance.now(); },
    tick: function ()   { this.timeStamp_tick = performance.now(); },
	stop: function ()   { this.timeStamp_stop = performance.now(); },

    getStop: function ()   { return this.timeStamp_stop - this.timeStamp_start; },
    getTick: function ()   { 
        const span = this.timeStamp_tick - this.timeStamp_start;
        return span > 0 ? span : 0;
    },

	print: function () { 
        console.log("Elapsed tick: " +  this.getTick() + " ms");
        console.log("Elapsed total: " + this.getStop() + " ms");
    },

    write: function() {
        document.getElementById('output').innerHTML = `Elapsed tick: ${this.getTick()} ms<br>Elapsed total: ${this.getStop()} ms`;
    }
}

dataset = {}
var colors = ["#ff0000", "#00ff00", "#0000ff"];
var colorIndex = 0;

function getHeight() {
    return 600;
}

function getWidth() {
    return 600;
}

function makeColorArray(size) {
    var array = [];
    for (let i = 0; i < size; i++) {
        array.push(getColor());
    }        
    return array;
}

function getColor(){
    var color = colors[colorIndex];
    colorIndex++;
    if (colorIndex >= colors.length) {
        colorIndex = 0;
    }
    return color;
}

function createMenu(thisID) {
    document.write(`\
            <li><a id="pie_Chart"       href="../PieChart/chartjs.html">Chart.js</a></li>\
            <li><a id="pie_Apex"        href="../PieChart/apexcharts.html">ApexCharts</a></li>\
            <li><a id="pie_Billboard"   href="../PieChart/billboard.html">Billboard.js</a></li>\
            <li><a id="pie_Toast"       href="../PieChart/toastui.html">Toast UI</a></li>\
            <li><a id="pie_Chartist"    href="../PieChart/chartist.html">Chartist</a></li>\
\
            <li><a id="line_Chart"       href="../LineChart/chartjs.html">Chart.js</a></li>\
            <li><a id="line_Apex"        href="../LineChart/apexcharts.html">ApexCharts</a></li>\
            <li><a id="line_Billboard"   href="../LineChart/billboard.html">Billboard.js</a></li>\
            <li><a id="line_Toast"       href="../LineChart/toastui.html">Toast UI</a></li>\
            <li><a id="line_Chartist"    href="../LineChart/chartist.html">Chartist</a></li>\
\
            <li><a id="bar_Chart"       href="../BarChart/chartjs.html">Chart.js</a></li>\
            <li><a id="bar_Apex"        href="../BarChart/apexcharts.html">ApexCharts</a></li>\
            <li><a id="bar_Billboard"   href="../BarChart/billboard.html">Billboard.js</a></li>\
            <li><a id="bar_Toast"       href="../BarChart/toastui.html">Toast UI</a></li>\
            <li><a id="bar_Chartist"    href="../BarChart/chartist.html">Chartist</a></li>\
\
            <li><a id="scatter_Chart"       href="../ScatterPlot/chartjs.html">Chart.js</a></li>\
            <li><a id="scatter_Apex"        href="../ScatterPlot/apexcharts.html">ApexCharts</a></li>\
            <li><a id="scatter_Billboard"   href="../ScatterPlot/billboard.html">Billboard.js</a></li>\
            <li><a id="scatter_Toast"       href="../ScatterPlot/toastui.html">Toast UI</a></li>\
            <li><a id="scatter_Chartist"    href="../ScatterPlot/chartist.html">Chartist</a></li>`);

    document.getElementById(thisID).setAttribute('class', 'active')
}

makeChart = {
    library: undefined,

    chartjs: function() { console.error("NO OVERRIDE CALLED! MISSING FILE!"); },
    apexCharts: function() { console.error("NO OVERRIDE CALLED! MISSING FILE!"); },
    billboard: function() { console.error("NO OVERRIDE CALLED! MISSING FILE!"); },
    toastUI: function() { console.error("NO OVERRIDE CALLED! MISSING FILE!"); },
    chartist: function() { console.error("NO OVERRIDE CALLED! MISSING FILE!"); },
}

function onFileSelected() {
    timer.start();
    const files = document.getElementById('fileselector').files; // FileList object
    const mainFile = files.item(0);
    
    if (files.length === 1) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {

            const extention = mainFile.name.split('.')[1];
            switch (extention.toLowerCase()) {
                case "csv":
                    dataset = parseCSV(reader.result);
                    break;

                default:
                    console.error("UNKNOWN FILETYPE! ONLY ACCEPTS .CSV!");
                    break;
            }

            // Wacky function hack
            // Reads dict at string location and returns
            // the object and then calls it like a function.
            // 
            // This looks better than several switch cases.
            // I swear!
            makeChart[makeChart.library](dataset);
        });

        reader.readAsText(mainFile, 'ISO-8859-1');
    }
}

function parseCSV(data) {
    data = data.replace(/["]/g, ""); // artifact from previous parser, keeping it in case of any CSV file containing strings
    const columns = data.slice(0, data.indexOf('\r\n')).split(',');
    const rows = data.split('\r\n').slice(1);

    return rows.map(function (row) {
        const values = row.split(',');
        const el = columns.reduce(function (object, header, index) {
            let value = values[index];

            if (!isNaN(value)) {
                value = Number(value);
            }

            object[header] = value;
            return object;
        }, {});
        return el;
    });
}
