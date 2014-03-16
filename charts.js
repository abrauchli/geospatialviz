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
    var year = selectedYears[0];
    data = getSankeyDataForCountryYear(type, regions.toArray(), year);

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

function getSankeyDataForCountryYear(type, states, year) {
    var t = getCountriesYear(type, states, year, true).toDataTable();
    var yearCol = (type === Type.ImportExportDiff ? 2 : getCountryYearCol(year));
    if (type === Type.ImportExportDiff) {
        t.insertColumn(0, 'string', "State");
        t.setColumnLabel(yearCol, "Import Export Difference");
    }
    var v = new google.visualization.DataView(t);
    var i;
    var maxMost = [];
    function ascSort(a,b) {return a-b}
    for (i = 0; i < t.getNumberOfRows(); ++i) {
        var val;
        if (type !== Type.ImportExportDiff) {
            val = t.getValue(i, yearCol);
        } else {
            // TODO: this case is still broken
            val = t.getValue(i, 3) - t.getValue(i, 2); // Exp-Imp
            t.setValue(i, yearCol, val); // Reuse imp column as difference
        }
        // pick at most the 20 largest values
        if (maxMost.length < 15) {
            maxMost.push(val);
        } else {
            maxMost = maxMost.sort(ascSort);
            if (val > maxMost[0])
                maxMost[0] = val;
        }
    }
    maxMost = maxMost.sort(ascSort);
    var threshold = maxMost[0];
    var rows = [];
    var sumOther = {};
    $.each(states, function(k) { sumOther[k] = 0; });
    for (i = 0; i < t.getNumberOfRows(); ++i) {
        val = t.getValue(i, yearCol);
        if (val < threshold) // let's ignore negative values on ImportExportDiff
            sumOther[t.getValue(i, Column.State)] += val;
        else
            rows.push(i);
    }
    $.each(states, function(k) {
        if (sumOther[k] >= threshold) {
            t.addRow();
            t.setCell(i, Column.State, k);
            t.setCell(i, Column.Country, "Others");
            t.setCell(i, yearCol, sumOther[k]);
            rows.push(i);
        }
    });
    v.setRows(rows);
    if (type === Type.ImportExportDiff) {
        v.setColumns([Column.State, 1, yearCol]);
    } else {
        v.setColumns([Column.State, Column.Country, yearCol]);
    }
    return v;
}
