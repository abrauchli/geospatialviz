//Script to paint the USA map and World Map
google.load('visualization', '1', {packages: ['geochart']});

function drawVisualization() {
  var data = google.visualization.arrayToDataTable([
    ['Country', 'Popularity'],
    ['Spain', 700],
    ['United States', 300],
    ['Brazil', 400],
    ['Canada', 500],
    ['France', 600],
    ['RU', 700]
  ]);

  var geochart = new google.visualization.GeoChart(
      document.getElementById('Worldmap'));
  geochart.draw(data, {width: 300, height: 300});
}



function drawMarkersMap() {
  var data = google.visualization.arrayToDataTable([
    ['State',   'Population', 'Area'],
    ['New York',      2761477,    1285.31],
    ['Hawaii',     1324110,    181.76],
    ['California',    959574,     117.27]
  ]);

  var options = {
    region: 'US',
    displayMode: 'regions',
    enableRegionInteractivity: 'true', 
    resolution: 'provinces',
    colorAxis: {colors: ['green', 'blue']},
    width: 500,
    height: 500
  };

  var chart = new google.visualization.GeoChart(document.getElementById('USAmap'));
  chart.draw(data, options);
};

google.setOnLoadCallback(drawVisualization);
google.setOnLoadCallback(drawMarkersMap);