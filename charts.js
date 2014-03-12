var charts = {
    byCountry: {
        sankey: null
    }
}

function initCharts() {
    charts.byCountry.sankey = new google.visualization.Sankey(document.getElementById('sankey'));

    //  google.visualization.events.addListener(chart, 'onmouseover', function() {
    //     console.log('go')
    // });
}

function drawSankeyChart() {
    //Set the data
    var type = getWorldSelectedType();
    var year = getWorldSelectedYear();
    data = getSankeyDataForCountryYear(type, region, year);

    // Set chart options
    var options = {
      width: 1215,
      sankey: {
        link: { color: { stroke: 'lightgrey', strokeWidth: 1 } },
        node: { label: { fontName: 'Times-Roman',
                         fontSize: 14,
                         color: '#871b47',
                         bold: true,
                         italic: true }, 
                nodePadding: 10}
      }
    };

    // Instantiate and draw Sankey chart
    charts.byCountry.sankey.draw(data, options);
}

function getSankeyDataForCountryYear(type, state, year) {
    var t = getCountriesYear(type, state, year, true).toDataTable();
    var v = new google.visualization.DataView(t);
    var yearCol = getCountryYearCol(year);
    var rows = [];
    var sumOther = 0;
    for (var i = 0; i < t.getNumberOfRows(); ++i) {
        var val = t.getValue(i, yearCol);
        if (val < 25)
            sumOther += val;
        else
            rows.push(i);
    }
    if (sumOther >= 25) { // TODO: no "Others" category with multiple states?
        t.addRow();
        t.setCell(i, Column.State, state);
        t.setCell(i, Column.Country, "Others");
        t.setCell(i, yearCol, sumOther);
        rows.push(i);
    }
    v.setRows(rows);
    v.setColumns([Column.State, Column.Country, yearCol]);
    return v;
}
