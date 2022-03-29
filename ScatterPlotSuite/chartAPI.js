function makeChart_ChartJS(canvas, data) {
    const ctx = canvas.getContext('2d');
    const myChart = new Chart(ctx, {
        //type: 'bar',
        //data: {
        //    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        //    datasets: [{
        //        label: '# of Votes',
        //        data: [12, 19, 3, 5, 2, 3],
        //        backgroundColor: [
        //            'rgba(255, 99, 132, 0.2)',
        //            'rgba(54, 162, 235, 0.2)',
        //            'rgba(255, 206, 86, 0.2)',
        //            'rgba(75, 192, 192, 0.2)',
        //            'rgba(153, 102, 255, 0.2)',
        //            'rgba(255, 159, 64, 0.2)'
        //        ],
        //        borderColor: [
        //            'rgba(255, 99, 132, 1)',
        //            'rgba(54, 162, 235, 1)',
        //            'rgba(255, 206, 86, 1)',
        //            'rgba(75, 192, 192, 1)',
        //            'rgba(153, 102, 255, 1)',
        //            'rgba(255, 159, 64, 1)'
        //        ],
        //        borderWidth: 1
        //    }]
        //},
        //options: {
        //    scales: {
        //        y: {
        //            beginAtZero: true
        //        }
        //    }
        //}

        type: 'bar',

        data,

        options: { 
            scales: { 
                y: { 
                    beginAtZero: true 
                } 
            } 
        }
    });
}

function parseFor_ChartJS(jsonObject) {
    data = { 
        labels: [],
        datasets: [{ 
            label: 'Monthly Salaries per Gender each Year',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
        }]
    };

    dat_m = {
        label: 'Men',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
    };

    dat_f = {
        label: 'Women',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
    };

    values = jsonObject.dataset.value;
    size = jsonObject.dataset.dimension.size;
    labels = jsonObject.dataset.dimension.Tid.category.label;

    for (let label in labels) {
        data.labels.push(label);
    }

    data.labes = ['Men', 'Women'];
    data.datasets = [dat_m, dat_f];

    for (let j = 0; j < size[0]; j++) { // should be two
        collected = []
        for (let i = 0; i < size[1]; i++) { // should be 14
            value = values[j * size[1] + i];
            collected.push(value);
        }
        data.datasets[j].data = collected;
    }

    return data;
}

function setAPI(choice) {
    apiChoice = choice;
    console.log("Api Chosen: " + apiChoice);
}

function onJSONParsed(jsonObject) {
    switch (apiChoice) {
        case "chartapi":
            console.log("Making CHART JS...");
            makeChart_ChartJS(document.getElementById('chart'), parseFor_ChartJS(jsonObject));
            break;
    
        default:
            console.error("INVALID API CHOICE: " + apiChoice);
            break;
    }
    
}

function onFileLoaded()
{
    const files = document.getElementById('fileselector').files; // FileList object
    
    if (files.length === 1) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const data = reader.result;
            onJSONParsed(JSON.parse(data));
        });

        const mainFile = files.item(0);
        reader.readAsText(mainFile);
    }
}
