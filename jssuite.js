timer = {
	timeStamp_start: 0,
	timeStamp_stop: 0,
    timeStamp_tick: 0,
	elapsed: function (timeStamp) { 
        let span = timeStamp - this.timeStamp_start;
        if (span < 0) {
            span = 0;
        }
        return span;
    },
	
	start: function () {
        this.ticks = [];
        this.timeStamp_start = performance.now();
    },
    tick: function () { this.ticks = performance.now(); },
	stop: function () { this.timeStamp_stop = performance.now(); },
	print: function () { 
        console.log("Elapsed tick: " + timer.elapsed(this.timeStamp_tick) + " ms");
        console.log("Elapsed total: " + timer.elapsed(this.timeStamp_stop) + " ms");
    }
}

dataset = {}

makeChart = {
    library: undefined,

    chartjs: function() { console.error("NO OVERRIDE CALLED! MISSING FILE!"); },
    apexCharts: function() { console.error("NO OVERRIDE CALLED! MISSING FILE!"); },
    billboard: function() { console.error("NO OVERRIDE CALLED! MISSING FILE!"); },
    toastUI: function() { console.error("NO OVERRIDE CALLED! MISSING FILE!"); },
    chartist: function() { console.error("NO OVERRIDE CALLED! MISSING FILE!"); },
}

function onFileSelected() {
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
