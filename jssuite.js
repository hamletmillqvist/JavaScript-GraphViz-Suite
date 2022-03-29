function range(start, end) {
    const length = end - start;
    
}

function parseCSV(data) {
    data = data.replace(/["]/g, "");
    const columns = data.slice(0, data.indexOf('\r\n')).split(',');
    const rows = data.split('\r\n').slice(1, 23);

    const dataset = rows.map(function (row) {
        const values = row.split(',');
        const el = columns.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
        }, {});
        return el;
    });

    return dataset;
}

function parsePie_chartjs(dataset) {    
    let numberMen = 0;
    let numberWomen = 0;

    for (let i = 0; i < dataset.length; i++) {
        const spanSexRow = dataset[i];
        let spanSexPopulation = parseInt(spanSexRow.Population_2021);

        if (spanSexRow.sex === "men") {
            numberMen = numberMen + spanSexPopulation;
        } else if (spanSexRow.sex === "women") {
            numberWomen = numberWomen + spanSexPopulation;
        }
    }

    const data = {
        labels: [
            'Men',
            'Women',
        ],
        datasets: [{
            label: 'Number of registered women & men 2021',
            data: [numberMen, numberWomen],
            backgroundColor: [
            'rgb(0, 0, 255)',
            'rgb(255, 0, 0)',
            ],
            hoverOffset: 4
        }]
    };
    return data;
}

function parseLine_chartjs(dataset) {
    let labels = [];
    for (let year = 1968; year <= 2021; year++)
        labels.push(year);

    let lenght = 2021 - 1968 + 1;
    let menConsensus = Array(lenght).fill(0);
    let womenConsensus = Array(lenght).fill(0);

    let isMen = true;

    // For each age/sex-group
    for (let i = 0; i < dataset.length; i++) {
        const spanSexRow = dataset[i];
        const entries = Object.entries(spanSexRow);
        
        // Add each year of the group 
        let lastEntryIndex = entries.findIndex(entry => entry[0] === 'Population_2021');
        for (let j = 2; j <= lastEntryIndex; j++) { // start at 1968 and goes to 2021
            const entry = entries[j];

            if (isMen) {
                menConsensus[j - 2] += parseInt(entry[1]);
            } else {
                womenConsensus[j - 2] += parseInt(entry[1]);
            }
        }

        isMen = !isMen;
    }

    const data = {
        labels: labels,
        datasets: [{
            label: '# of Men',
            data: menConsensus,
            fill: false,
            borderColor: 'rgb(0, 0, 255)',
            tension: 0.1
        }, {
            label: '# of Women',
            data: womenConsensus,
            fill: false,
            borderColor: 'rgb(255, 0, 0)',
            tension: 0.1
        }]
    };
    return data;
}

function makeChart_ChartJS(canvas, data) {
    const ctx = canvas.getContext('2d');
    const dataset = parseCSV(data);
    const config = { type: undefined, data: undefined };

    switch (chartType) {
        case "pie":
            config.type = "pie";
            config.data = parsePie_chartjs(dataset);
            new Chart(ctx, config);
            break;

        case "line":
            config.type = "line";
            config.data = parseLine_chartjs(dataset);
            new Chart(ctx, config);
            break;
    
        default:
            console.log("NO CHART TYPE SELECTED!");
            break;
    }
}

function setAPI(choice) {
    apiChoice = choice;
    console.log("Api Chosen: " + apiChoice);
}

function setChartType(choice) {
    chartType = choice;
    console.log("Will draw: " + chartType);
}

function onFileLoaded(fileContents) {
    switch (apiChoice) {
        case "chartapi":
            console.log("Making CHART JS...");
            makeChart_ChartJS(document.getElementById('chart'), fileContents);
            break;
    
        default:
            console.error("INVALID API CHOICE: " + apiChoice);
            break;
    }
    
}

function onFileSelected()
{
    const files = document.getElementById('fileselector').files; // FileList object
    
    if (files.length === 1) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const data = reader.result;
            onFileLoaded(data);
        });

        const mainFile = files.item(0);
        reader.readAsText(mainFile, 'ISO-8859-1');
    }
}
