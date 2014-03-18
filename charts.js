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
    var data = getSankeyDataForCountry(type, regions.toArray(), worldSelectedYears);

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

function getSankeyDataForCountry(type, states, years) {
    var ct;
    var t = getCountriesYearUngrouped(type, states, years, true);
    ct = states.length > 1 ? getCountriesYear(type, states, years) : t;
    var yearCols = [];
    if (type === Type.ImportExportDiff) {
        for (var i = 2; i < years.length+2; ++i)
            yearCols.push(i);
    } else {
        $.each(years, function(k,v) { yearCols.push(getCountryYearCol(v)); });
    }
    var i;
    var maxMost = [];
    var countries = [];
    function ascSort(a,b) {return a[0]-b[0]}
    for (i = 0; i < ct.getNumberOfRows(); ++i) {
        var sum = 0;
        if (t === ct) {
            $.each(yearCols, function(k,v) { sum += ct.getValue(i, v); });
            if (type === Type.ImportExportDiff) {
                $.each(yearCols, function(k,v) { sum -= ct.getValue(i, v+years.length); });
            }
        } else {
            sum = ct.getValue(i, 1);
        }
        if (isNaN(sum)) throw new Error("NaN sum");
        // pick at most the 15 largest values
        if (maxMost.length < 15) {
            maxMost.push([sum,i]);
        } else {
            maxMost = maxMost.sort(ascSort);
            if (sum > maxMost[0][0])
                maxMost[0] = [sum, i];
        }
    }
    maxMost = maxMost.sort(ascSort);
    var col;
    if (t === ct) {
        col = (type === Type.ImportExportDiff ? 1 : Column.Country);
        if (ct.getColumnLabel(col) !== "Country")
          throw new Error("bah");
        for (i = 0; i < maxMost.length; ++i)
            countries.push(ct.getValue(i, col));
    } else {
        if (ct.getColumnLabel(0) !== "Country")
          throw new Error("bah");
        for (i = 0; i < maxMost.length; ++i)
            countries.push(ct.getValue(i, 0));
    }
    var v = new google.visualization.DataView(t);
    var rows = [];
    var sumOther = {};
    $.each(states, function(k,v) { sumOther[v] = 0; });
    for (i = 0; i < t.getNumberOfRows(); ++i) {
        col = (type === Type.ImportExportDiff ? 1 : Column.Country);

        var country = t.getValue(i, col);
        if (ct.getColumnLabel(col) !== "Country")
          throw new Error("bah");
        var val = 0;
        $.each(yearCols, function(k,v) { val += t.getValue(i, v); });
        if (type === Type.ImportExportDiff) {
            $.each(yearCols, function(k,v) { val -= t.getValue(i, v+years.length); });
            val *= -1; // it's e-i but imports are listed first
        }
        if (isNaN(val)) throw new Error("NaN val");
        if (val <= 0 || countries.indexOf(country) < 0) // ignore negative values on ImportExportDiff
            sumOther[t.getValue(i, Column.State)] += val;
        else
            rows.push(i);
    }
    $.each(states, function(k,v) {
        if (sumOther[v] > 0) {
            t.addRow();
            t.setCell(i, Column.State, v);
            t.setCell(i, (type === Type.ImportExportDiff ? 1 : Column.Country), "Others");
            t.setCell(i, yearCols[0], sumOther[v]);
            rows.push(i);
            ++i;
        }
    });
    v.setRows(rows);
    if (type === Type.ImportExportDiff) {
        v.setColumns([Column.State, 1, yearCols[0]]);
    } else {
        v.setColumns([Column.State, Column.Country, yearCols[0]]);
    }
    return v;
}
