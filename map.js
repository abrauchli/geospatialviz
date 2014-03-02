//Script to paint the USA map and World Map

//Load the Geochart Library
google.load('visualization', '1', {packages: ['geochart']});

//Function to paint the WorldMap
function worldMap() {
  var World = new google.visualization.GeoChart(
      document.getElementById('Worldmap'));
  var view = new google.visualization.DataView(stateExportCountries);

  view.setRows(view.getFilteredRows([
    // Filter out current state w/o the "total" rows
    {column: 0, value: 'AK'},
    {column: 1, minValue: 1}
  ]));

  // Filter out the country (2), year1 and year2
  view.setColumns([
    2,
    3,
    {
      label: 'Years',
      type: 'string',
      role: 'tooltip',
      calc: function(t,r) {
        return 'Col3: '+ t.getValue(r, 3);
      }
    }
  ]);
  World.draw(view, {
    width: 710,
    height: 372,
    colorAxis: {
      maxValue: 1000 ,
      colors: ['#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#E0D39E','#E0D39E','#E0D39E','#E0D39E','#E0D39E','#E0D39E','#E0D39E','#E0D39E']
    }
  });

  //Function to get the name of the country we click on the world map
  google.visualization.events.addListener(World, 'regionClick', function(eventData) {
    region = eventData.region;
    console.log(region);
  });

}


//Function to paint the USA map
function usaMap() {
  var options = {
    region: 'US',
    displayMode: 'regions',
    enableRegionInteractivity: 'true', 
    resolution: 'provinces',
    colorAxis: {colors: ['green', 'blue']},
    legend: false,
    width: 500,
    height: 372
  };

  var USA = new google.visualization.GeoChart(document.getElementById('USAmap'));
  var comView = new google.visualization.DataView(stateExportCommodities);
  /**
   * Return a list of rows matching an hscode category
   * @param t the table to search (DataView)
   * @param c the hscode prefix to match
   */
  var hscodeRowFilter = function(t, c) {
    var i = 0,
        n = t.getNumberOfRows(),
        ret = [];
    for (; i < n; ++i) {
      if ((t.getValue(i, 2)).substr(0, c.length) === c
          && t.getValue(i, 1) > 0) {
        ret.push(i);
      }
    }
    return ret;
  }
  comView.setRows(hscodeRowFilter(comView, '26'));
  comView.setColumns([0, 4 /* 2009 */]);
  USA.draw(comView, options);

  //Function to get the name of the country we click on the USA map
  google.visualization.events.addListener(USA, 'regionClick', function(eventData)
  {
    region = eventData.region;
    region = region.substring(3,5)
    console.log(region)
  });
};
