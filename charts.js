//Function to draw a Sankey Chart
function drawChart() {
    //Set the data
    var type='imports';
    $('#worldimportexport').change( function() {
        var ie = $('#worldimportexport').val(); // 0: import, 1: export, 2: combined
        if (ie=='Imports') var type='imports';
        else if (ie=='Exports') var type='exports';
        data = dataForCountryYear(type,region,2009);
        chart.draw(data, options);
        console.log(type)
    });
    data = dataForCountryYear(type,region,2009);

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
                nodePadding: 10} }
    };

    // Instantiate and draw Sankey chart
    var chart = new google.visualization.Sankey(document.getElementById('sankey'));
    chart.draw(data, options);

     google.visualization.events.addListener(chart, 'onmouseover', function()
    {
        console.log('go')
    });
}

function dataForCountryYear(type,state,year){
    //Fill in data
    var country = getCountries(type,state)
    var trading_countries = [];
    var year = getCountryYearCol(year);
    var rows = country.getNumberOfRows();
    var value = [];
    for (var i=0; i<rows; i++){
        if(country.getValue(i,3)>30){
            value.push(country.getValue(i,3));
            trading_countries.push(country.getValue(i,2))
        }
    }

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'From');
    data.addColumn('string', 'To');
    data.addColumn('number', 'Weight');
    data.addRows(trading_countries.length);
    for (var i=0; i<trading_countries.length; i++){
        data.setCell(i, 0, state);
        data.setCell(i, 1, trading_countries[i]);
        data.setCell(i, 2, value[i])
    }
    return(data)
}