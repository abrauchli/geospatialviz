//Script to paint the USA map and World Map

//Load the Geochart Library
google.load('visualization', '1', {packages: ['geochart']});

//Function to paint the WorldMap
function worldMap() {
  var World = new google.visualization.GeoChart(
      document.getElementById('Worldmap'));
  var view = getExportCountries('AK', 2009);
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

  comView.setRows(hscodeRowFilter(comView, '26'));
  comView.setColumns([0, 4 /* 2009 */]);
  USA.draw(comView, options);

  //Function to get the name of the country we click on the USA map
  google.visualization.events.addListener(USA, 'regionClick', function(eventData)
  {
    region = eventData.region;
    region = region.substring(3,5);
    console.log(region)
  });
};
