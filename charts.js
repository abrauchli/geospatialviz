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
    var yearCol = (type === Type.ImportExportDiff ? 2 : getCountryYearCol(year));
    if (type === Type.ImportExportDiff) {
        t.insertColumn(0, 'string', "State");
        t.setColumnLabel(yearCol, "Import Export Difference");
    }
    var v = new google.visualization.DataView(t);
    var rows = [];
    var sumOther = 0;
    for (var i = 0; i < t.getNumberOfRows(); ++i) {
        var val;
        if (type !== Type.ImportExportDiff) {
            val = t.getValue(i, yearCol);
        } else {
            val = t.getValue(i, 3) - t.getValue(i, 2); // Exp-Imp
            t.setValue(i, yearCol, val); // Reuse imp column as difference
            t.setValue(i, Column.State, state);
        }
        if (val < 25) // TODO: what about negative values with difference?
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
    if (type === Type.ImportExportDiff) {
        v.setColumns([Column.State, 1, yearCol]);
    } else {
        v.setColumns([Column.State, Column.Country, yearCol]);
    }
    return v;
}
