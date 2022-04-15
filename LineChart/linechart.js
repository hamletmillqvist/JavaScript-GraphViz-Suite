function parseLine_MakeData(dataset) {
    const lenght = 2021 - 1968 + 1;
    let data = {
        labels: [],
        menConsensus: Array(lenght).fill(0),
        womenConsensus: Array(lenght).fill(0),
    };

    for (let year = 1968; year <= 2021; year++)
        data.labels.push(year);


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
                data.menConsensus[j - 2] += parseInt(entry[1]);
            } else {
                data.womenConsensus[j - 2] += parseInt(entry[1]);
            }
        }

        isMen = !isMen;
    }

    return data;
}

function parseLine_chartjs(dataset) {
    const data = parseLine_MakeData(dataset);

    return {
        labels: data.labels,
        datasets: [{
            label: '# of Men',
            data: data.menConsensus,
            fill: false,
            borderColor: 'rgba(0,143,251)',
            tension: 0.1
        }, {
            label: '# of Women',
            data: data.womenConsensus,
            fill: false,
            borderColor: 'rgba(0,227,150)',
            tension: 0.1
        }]
    };
}

function parseLine_apexCharts(dataset) {
    const data = parseLine_MakeData(dataset);

    return {
        chart: {
            type: 'line'
        },
        series: [
            {
                name: "# of Men",
                data: data.menConsensus
            },
            {
                name: "# of Women",
                data: data.womenConsensus
            },
        ],
        xaxis: {
          categories: data.labels,
        }
    }
}

function parseLine_billboard(bindString, dataset) {
    const data = parseLine_MakeData(dataset);
	
    return {
        data: {
            x: "Years",
            columns: [
                ["Years"].concat(data.labels),
                ["Men"].concat(data.menConsensus),
                ["Women"].concat(data.womenConsensus),
            ],
            type: "line",
            colors: {
                Men: "rgba(0,143,251)",
                Women: "rgba(0,227,150)",
            },
        },
        bindto: bindString,
    };
}

function parseLine_toastUI(dataset) {
	const data = parseLine_MakeData(dataset);
	
	return {
	  categories: data.labels,
	  series: [
		{
		  name: '# of Men',
		  data: data.menConsensus,
		},
		{
		  name: '# of Women',
		  data: data.womenConsensus,
		},
	  ],
	};
}
