var charts = {
    byCountry: {
        sankey: null
    },
    byCommodity: {
        pie:null,
        hist:null,
        bar:null
    }
}

function initCharts() {
    //charts for International Trading
    charts.byCountry.sankey = new google.visualization.Sankey(document.getElementById('sankey'));
    //charts for commodites
    charts.byCommodity.pie = new google.visualization.PieChart(document.getElementById('pie'));
    charts.byCommodity.hist = new google.visualization.Histogram(document.getElementById('histogram'));
    charts.byCommodity.bar = new google.visualization.ColumnChart(document.getElementById('Bar'));
}

function drawSankeyChart() {
    //Set the data
    var type = getWorldSelectedType();
    var reg = regions.toArray();
    var data = (reg.length > 0 && worldSelectedYears.length > 0)
        ? getSankeyDataForCountry(type, reg, worldSelectedYears)
        : new google.visualization.DataTable({cols:[{type:'string'},{type:'string'},{type:'number'}]});

    // Set chart options
    var options = {
      width: 1215,
      sankey: {
        link: { color: { stroke: 'lightgrey', strokeWidth: 1 } },
        node: { label: { fontFamily: 'sans-serif',
                         fontSize: 14,
                         color: '#871b47',
                         bold: true },
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
    var col = (type === Type.ImportExportDiff ? 1 : Column.Country);
    if (t === ct) {
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
        var country = t.getValue(i, col);
        if (t.getColumnLabel(col) !== "Country")
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

function drawPieChart(){//Only two sets of data possibles (sum previous years in case of multiple selection?)
    var type = getCommSelectedType();
    var comView = getStateAggregateCommoditiesYears(type,regions.toArray(), select_commodities, [commSelectedYears[0]],true);
    console.log(comView)
    if(typeof commSelectedYears[1] === 'undefined') {
        var i=0;
        var comView1 = getStateAggregateCommoditiesYears(type,regions.toArray(), select_commodities, [commSelectedYears[0]],true);
    }else {
        var i=1
        var comView = getStateAggregateCommoditiesYears(type,regions.toArray(), select_commodities, [commSelectedYears[0]],true);
        var comView1 = getStateAggregateCommoditiesYears(type,regions.toArray(), select_commodities, [commSelectedYears[1]],true);
    }
    if (i==0) str = 'Hscode: ' + select_commodities[0] + ', for the year: ' + commSelectedYears[0];
    else str = 'Hscode: ' + select_commodities[0] + ' Export Diff ' + commSelectedYears[0] + '-' + commSelectedYears[i];
    var options = {
        title: str,
        legend: 'none',
        diff: {comView: { opacity: 0.15 }} ,
        pieSliceText: 'percentage',
        width: 300,
        height: 240
    };

    var diffData = charts.byCommodity.pie.computeDiff(comView, comView1);
    charts.byCommodity.pie.draw(diffData, options);
}

function drawHistogram(){
    var type = getCommSelectedType();
    var data = getStateAggregateCommoditiesYears(type,regions.toArray(), select_commodities, commSelectedYears, true);
    var options = {
        title: 'Distribution for commodities',
        legend: { position: 'none' },
        width:300,
        height: 200
    };
    charts.byCommodity.hist.draw(data, options);
}

function drawBarChart() {
    var type = getCommSelectedType();
    var data = getStateAggregateCommoditiesYears(type,regions.toArray(), select_commodities, commSelectedYears, true);
    var options = {
        title: 'Distribution for selected States',
        hAxis: {title: 'States', titleTextStyle: {color: 'red'}}
    };
    charts.byCommodity.bar.draw(data, options);
}
