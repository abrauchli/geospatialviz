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
  World.draw(data, {width: 730, height: 372});
}


//Function to paint the USA map
function usaMap() {
  var data = google.visualization.arrayToDataTable([
    ['State', 'Popularity', 'Cuantity'],
    ['Hawaii', 700, 122],
    ['California', 300, 1223],
    ['Arizona', 400, 900],
    ['Texas', 500, 800],
    ['New Mexico', 600, 722],
    ['Ontario', 700, 300]
  ]);

  var options = {
    region: 'US',
    displayMode: 'regions',
    enableRegionInteractivity: 'true', 
    resolution: 'provinces',
    colorAxis: {colors: ['green', 'blue']},
    showLegend: true,
    width: 500,
    height: 320
  };

  var USA = new google.visualization.GeoChart(document.getElementById('USAmap'));
  USA.draw(data, options);
};

google.setOnLoadCallback(worldMap);
google.setOnLoadCallback(usaMap);