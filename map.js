//Script to paint the USA map and World Map

//Load the Geochart Library
google.load('visualization', '1', {packages: ['geochart']});

//Function to paint the WorldMap
function worldMap() {
  var data = google.visualization.arrayToDataTable([
    ['Country', 'Popularity', 'Cuantity'],
    ['Spain', 700, 122],
    ['United States', 300, 1223],
    ['Brazil', 400, 900],
    ['Canada', 500, 800],
    ['France', 600, 722],
    ['RU', 700, 300]
  ]);
  var World = new google.visualization.GeoChart(
      document.getElementById('Worldmap'));
  World.draw(data, {width: 710, height: 372});

  //Function to get the name of the country we click on the world map
  google.visualization.events.addListener(World, 'regionClick', function(eventData)
    {
      region = eventData.region;
      console.log(region)
    });
}


//Function to paint the USA map
function usaMap() {
  var data = google.visualization.arrayToDataTable([
    ['State', "Description", "2012"],
    ['Alabama', "ZINC ORES AND CONCENTRATES", 0.3],
    ['Alaska', "ZINC ORES AND CONCENTRATES", 0.5]
  ]);

  var options = {
    region: 'US',
    displayMode: 'regions',
    enableRegionInteractivity: 'true', 
    resolution: 'provinces',
    colorAxis: {colors: ['green', 'blue']},
    showLegend: true,
    width: 500,
    height: 372
  };

  var USA = new google.visualization.GeoChart(document.getElementById('USAmap'));
  USA.draw(data, options);

  //Function to get the name of the country we click on the USA map
  google.visualization.events.addListener(USA, 'regionClick', function(eventData)
  {
    region = eventData.region;
    region = region.substring(3,5)
    console.log(region)
  });
};
