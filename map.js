//Script to paint the USA map and World Map

//Load the Geochart Library
google.load('visualization', '1', {packages: ['geochart']});
//Function to paint the WorldMap
function drawWorldMap() {
  var ie = $('#worldimportexport').get(0).selectedIndex; // 0: import, 1: export, 2: combined
  var str = (ie === 0) ? "Imports" : ((ie === 1) ? "Exports" : "Imports/Exports");
  $('#worldmapdesc').text(str +" for "+region);

  var world = new google.visualization.GeoChart(
      document.getElementById('worldmap'));
  var view = getExportCountriesYear(region, 2009);
  world.draw(view, {
    width: 710,
    height: 372,
    colorAxis: {
      maxValue: 1000 ,
      colors: ['#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#438094','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#E0D39E','#E0D39E','#E0D39E','#E0D39E','#E0D39E','#E0D39E','#E0D39E','#E0D39E']
    }
  });

  //Function to get the name of the country we click on the world map
  google.visualization.events.addListener(world, 'regionClick', function(eventData) {
    region = eventData.region;
    console.log(region);
  });

}

function drawSelectionUSMap(data) {
  var options = {
    region: 'US',
    displayMode: 'regions',
    enableRegionInteractivity: 'true',
    resolution: 'provinces',
    legend: false,
    width: 500,
    height: 300
  };

  var USA = new google.visualization.GeoChart(document.getElementById('USselectmap'));
  USA.draw(data, options);

  //Function to get the name of the country we click on the USA Selection map
  google.visualization.events.addListener(USA, 'regionClick', function(eventData)
  {
    region = eventData.region.substr(3,5);
    drawWorldMap()
    var selection = google.visualization.arrayToDataTable([
        ['region', 'selected'],
        [region, region]
        ]);
    USA.draw(selection, options);
    drawChart();
  });
}

function drawCommoditiesUSMap() {
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
  var comView = getExportCommoditiesYear('ALL', '26', 2009);
  USA.draw(comView, options);

  //Function to get the name of the country we click on the USA map
  google.visualization.events.addListener(USA, 'regionClick', function(eventData)
  {
    region = eventData.region;
    region = region.substring(3,5);
  });
};
