$(document).ready(function() {
// ====================== Data Loading ========================

// data from https://health-infobase.canada.ca/mental-health/suicide-self-harm/suicide-mortality.html
// hardcoding data to avoid CORS issue
// maintaining CSV formatting to preserve data digestion method
var SUI_MOR_MAP_CSV = 
`Year,PT_EN,PT_FR,Number,Rate_per_100000
2020,Canada,Canada,"4,152",10.9
2020,British Columbia,Colombie-Britannique,365,6.9
2020,Alberta,Alberta,615,14.3
2020,Saskatchewan,Saskatchewan,198,17.6
2020,Manitoba,Manitoba,187,13.9
2020,Ontario,Ontario,1419,9.6
2020,Quebec,Québec,1068,12.2
2020,New Brunswick,Nouveau-Brunswick,92,11.8
2020,Nova Scotia,Nouvelle-Écosse,108,11
2020,Prince Edward Island,Île-du-Prince-Édouard,7,4.1
2020,Newfoundland and Labrador,Terre-Neuve-et-Labrador,58,10.9
2020,Yukon,Yukon,NA,NA
2020,Northwest Territories,Territoires du Nord-Ouest,5,11.5
2020,Nunavut,Nunavut,30,72.2`;

const provinceKey = {
    "British Columbia": "ca-bc",
    "Alberta": "ca-ab",
    "Saskatchewan": "ca-sk",
    "Manitoba": "ca-mb",
    "Ontario": "ca-on",
    "Quebec": "ca-qc",
    "New Brunswick": "ca-nb",
    "Nova Scotia": "ca-ns",
    "Prince Edward Island": "ca-pe",
    "Newfoundland and Labrador": "ca-nl",
    "Yukon": "ca-yt",
    "Northwest Territories": "ca-nt",
    "Nunavut": "ca-nu"
};

// formatted data for the map chart
var highchartsMapData = []

Papa.parse(SUI_MOR_MAP_CSV, {
    complete: function(results) {
        const csvData = results.data;
        
        const headers = csvData[0];
        const rows = csvData.slice(1);

        const provinceIndex = headers.indexOf("PT_EN");
        const rateIndex = headers.indexOf("Rate_per_100000");

        highchartsMapData = rows.map(row => {
            const province = row[provinceIndex];
            const rate = row[rateIndex] === "NA" ? null : parseFloat(row[rateIndex]);
            const key = provinceKey[province];
            return key ? { "hc-key": key, "value": rate} : null;
        }).filter(Boolean);

        // console.log("map data: ", highchartsMapData)
    }
});

var SUI_MOR_AGE_SEX_CSV = 
`Year,PT_EN,PT_FR,Agegroup,Sex,Number,Rate_per_100000,Population
2020,Canada,Canada,10 to 19,Both sexes,219,5.2,"4,174,081"
2020,Canada,Canada,20 to 34,Both sexes,1051,13.5,"7,785,167"
2020,Canada,Canada,35 to 49,Both sexes,1049,14,"7,482,606"
2020,Canada,Canada,50 to 64,Both sexes,1119,14.4,"7,755,831"
2020,Canada,Canada,65 to 79,Both sexes,526,10.2,"5,174,686"
2020,Canada,Canada,80 and older,Both sexes,187,11.2,"1,669,718"
2020,Canada,Canada,10 to 19,Males,133,6.2,"2,130,138"
2020,Canada,Canada,20 to 34,Males,771,19.2,"4,008,973"
2020,Canada,Canada,35 to 49,Males,794,21.3,"3,721,197"
2020,Canada,Canada,50 to 64,Males,856,22.3,"3,843,312"
2020,Canada,Canada,65 to 79,Males,410,16.6,"2,475,932"
2020,Canada,Canada,80 and older,Males,147,21.7,"676,233"
2020,Canada,Canada,10 to 19,Females,86,4.2,"2,043,943"
2020,Canada,Canada,20 to 34,Females,280,7.4,"3,776,194"
2020,Canada,Canada,35 to 49,Females,255,6.8,"3,761,409"
2020,Canada,Canada,50 to 64,Females,263,6.7,"3,912,519"
2020,Canada,Canada,65 to 79,Females,116,4.3,"2,698,754"
2020,Canada,Canada,80 and older,Females,40,4,"993,485"`;

// formatted data for the column chart
var highchartsAgeSexData = [];
var maleRateData = [];
var femaleRateData = [];
// formatted data for the donut chart
var maleNumberData = [];
var femaleNumberData = [];

Papa.parse(SUI_MOR_AGE_SEX_CSV, {
    complete: function(results) {
        const csvData = results.data;
        
        const headers = csvData[0];
        const rows = csvData.slice(1);

        const sexIndex = headers.indexOf("Sex");
        const numberIndex = headers.indexOf("Number");
        const rateIndex = headers.indexOf("Rate_per_100000");
        
        highchartsAgeSexData = rows.map(row => {
            const sex = row[sexIndex];
            const number = parseFloat(row[numberIndex]);
            const rate = parseFloat(row[rateIndex]);
            return { "sex": sex, "number": number, "rate": rate };
        });

        highchartsAgeSexData.forEach(element => {
            if (element.sex === "Males") {
                maleNumberData.push(element.number);
                maleRateData.push(element.rate);
            } 
            if (element.sex === "Females") {
                femaleNumberData.push(element.number);
                femaleRateData.push(element.rate);
            }
        });

        // console.log("age/sex data: ", highchartsAgeSexData)
    }
});

var SUI_MOR_OT_CSV = 
`Year,PT_EN,PT_FR,Sex,Number,Rate_per_100000
2006,Canada,Canada,Both sexes,3512,10.8
2007,Canada,Canada,Both sexes,3611,11
2008,Canada,Canada,Both sexes,3705,11.1
2009,Canada,Canada,Both sexes,3890,11.5
2010,Canada,Canada,Both sexes,3951,11.6
2011,Canada,Canada,Both sexes,3896,11.3
2012,Canada,Canada,Both sexes,3926,11.3
2013,Canada,Canada,Both sexes,4054,11.5
2014,Canada,Canada,Both sexes,4254,12
2015,Canada,Canada,Both sexes,4405,12.3
2016,Canada,Canada,Both sexes,3978,11
2017,Canada,Canada,Both sexes,4462,12.3
2018,Canada,Canada,Both sexes,4576,12.4
2019,Canada,Canada,Both sexes,4581,12.2
2020,Canada,Canada,Both sexes,4152,10.9
2006,Canada,Canada,Males,2695,17
2007,Canada,Canada,Males,2727,16.9
2008,Canada,Canada,Males,2777,17
2009,Canada,Canada,Males,2989,18.1
2010,Canada,Canada,Males,2981,17.8
2011,Canada,Canada,Males,2910,17.1
2012,Canada,Canada,Males,2972,17.4
2013,Canada,Canada,Males,3041,17.6
2014,Canada,Canada,Males,3159,18.1
2015,Canada,Canada,Males,3269,18.5
2016,Canada,Canada,Males,2939,16.5
2017,Canada,Canada,Males,3325,18.5
2018,Canada,Canada,Males,3444,18.9
2019,Canada,Canada,Males,3481,18.7
2020,Canada,Canada,Males,3112,16.5
2006,Canada,Canada,Females,817,5
2007,Canada,Canada,Females,884,5.3
2008,Canada,Canada,Females,928,5.5
2009,Canada,Canada,Females,901,5.3
2010,Canada,Canada,Females,970,5.7
2011,Canada,Canada,Females,986,5.7
2012,Canada,Canada,Females,954,5.5
2013,Canada,Canada,Females,1013,5.7
2014,Canada,Canada,Females,1095,6.1
2015,Canada,Canada,Females,1136,6.3
2016,Canada,Canada,Females,1039,5.7
2017,Canada,Canada,Females,1137,6.3
2018,Canada,Canada,Females,1132,6.2
2019,Canada,Canada,Females,1100,5.9
2020,Canada,Canada,Females,1040,5.5`;

var highchartsYearAgeSexData = [];
var lineYearData = [];
var donutMaleNumberData = [];
var lineMaleRateData = [];
var donutFemaleNumberData = [];
var lineFemaleRateData = [];
var lineBothRateData = [];

Papa.parse(SUI_MOR_OT_CSV, {
    complete: function(results) {
        const csvData = results.data;
        
        const headers = csvData[0];
        const rows = csvData.slice(1);

        const yearIndex = headers.indexOf("Year");
        const sexIndex = headers.indexOf("Sex");
        const numberIndex = headers.indexOf("Number");
        const rateIndex = headers.indexOf("Rate_per_100000");
        
        highchartsYearAgeSexData = rows.map(row => {
            const year = row[yearIndex];
            const sex = row[sexIndex];
            const number = parseFloat(row[numberIndex]);
            const rate = parseFloat(row[rateIndex]);
            return { "year": year, "sex": sex, "number": number, "rate": rate };
        });

        highchartsYearAgeSexData.forEach(element => {
            if (element.sex === "Males") {
                donutMaleNumberData.push(element.number);
                lineMaleRateData.push(element.rate);
            } 
            if (element.sex === "Females") {
                donutFemaleNumberData.push(element.number);
                lineFemaleRateData.push(element.rate);
            }
            if (element.sex === "Both sexes") {
                lineBothRateData.push(element.rate);
                lineYearData.push(element.year);
            }
        });

        // console.log(highchartsYearAgeSexData);
    }
});



    // ====================== Donut Chart ========================
    Highcharts.chart('donut-chart', {
        chart: {
            type: 'pie'
        },
        title: {
            text: '2020, Total Suicide Mortality by Sex'
        },
        plotOptions: {
            pie: {
                innerSize: '50%',
                dataLabels: {
                    enabled: false,
                    format: '{point.name}: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            name: 'Amount',
            data: [
                { name: 'Male', y: maleNumberData.reduce((a, b) => a + b, 0) },
                { name: 'Female', y: femaleNumberData.reduce((a, b) => a + b, 0) }
            ]
        }]
    });


    // ====================== Donut Chart ========================
    Highcharts.chart('donut-chart1', {
        chart: {
            type: 'pie'
        },
        title: {
            text: '2006-2020, Total Suicide Mortality by Sex'
        },
        plotOptions: {
            pie: {
                innerSize: '50%',
                dataLabels: {
                    enabled: false,
                    format: '{point.name}: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            name: 'Amount',
            data: [
                { name: 'Male', y: donutMaleNumberData.reduce((a, b) => a + b, 0) },
                { name: 'Female', y: donutFemaleNumberData.reduce((a, b) => a + b, 0) }
            ]
        }]
    });

    // ====================== Line Chart ========================
    Highcharts.chart('line-chart', {
        title: {
            text: '2006-2020, Age-Standardized Suicide Mortality Rates Per 100,000 by Sex'
        },
        xAxis: {
            categories: lineYearData
        },
        series: [{
            data: lineMaleRateData,
            name: 'Male'
        }, {
            data: lineFemaleRateData,
            name: 'Female'
        }, {
            data: lineBothRateData,
            name: 'Both Sexes'
        }]

    });


    // ===================== Column Chart ========================
    Highcharts.chart('column-chart', {
        chart: {
            type: 'column'
        },
        title: {
            text: '2020, Age and Sex Specific Suicide Mortality 100,000 people'
        },
        xAxis: {
            title: {
                text: 'Age group'
            },
            categories: [
                '10 to 19', 
                '20 to 34', 
                '35 to 49', 
                '50 to 64', 
                '65 to 79', 
                '80 and older'
            ]
        },
        yAxis: {
            title: {
                text: 'Age-specific rate per 100,000 people'
            }
        },
        series: [
            {
                name: 'Males',
                data: maleRateData
            },
            {
                name: 'Females',
                data: femaleRateData
            }
        ]
    });


    // ======================= Map Chart =========================
    fetch('https://code.highcharts.com/mapdata/countries/ca/ca-all.topo.json')
        .then(response => response.json())
        .then(mapData => {
            Highcharts.mapChart('map-chart', {
                chart: {
                    map: mapData
                },
                title: {
                    text: '2020, Age-Standardized Suicide Mortality Per 100,000 People'
                },
                colorAxis: {
                    min: 0,
                    minColor: '#bce8b5',
                    maxColor: '#005645'
                },
                series: [{
                    data: highchartsMapData,
                    name: 'Suicide Mortality Per 100,000 People',
                    states: {
                        hover: {
                            color: '#a4edba'
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    }
                }]
            });
        })
        .catch(error => console.error('Error loading map data:', error));

});
