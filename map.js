//Script to paint the USA map and World Map

//Load the Geochart Library
google.load('visualization', '1', {packages: ['geochart']});

var maps = {
    byCountry: {
        usa: null,
        usaOptions: {
            region: 'US',
            displayMode: 'regions',
            enableRegionInteractivity: 'true',
            resolution: 'provinces',
            legend: false,
            width: 500,
            height: 300
        },
        world: null,
        worldOptions: {
            width: 710,
            height: 372
        }
    },
    byCommodity: {
        usa: null,
        usaOptions: {
            region: 'US',
            displayMode: 'regions',
            enableRegionInteractivity: 'true',
            resolution: 'provinces',
            colorAxis: {colors: ['green', 'blue']},
            legend: false,
            width: 500,
            height: 372
        }
    }
};

function initMaps() {
  // Commodity Maps
  maps.byCommodity.usa = new google.visualization.GeoChart(document.getElementById('USAmap'));
  google.visualization.events.addListener(maps.byCommodity.usa, 'regionClick', function(eventData) {
    region = eventData.region;
    region = region.substring(3,5);
  });

  // Country Maps
  maps.byCountry.world = new google.visualization.GeoChart(document.getElementById('worldmap'));
  maps.byCountry.usa = new google.visualization.GeoChart(document.getElementById('USselectmap'));
  google.visualization.events.addListener(maps.byCountry.usa, 'regionClick', function(eventData) {
    region = eventData.region.substr(3,5);
    var selection = google.visualization.arrayToDataTable([
        ['region', 'selected'],
        [region, region]
    ]);
    maps.byCountry.usa.draw(selection, maps.byCountry.usaOptions);
    onWorldMapDataChanged();
    //Need something to eliminate the selected elemented in the search bar.
  });
}

// === Helper functions only for world map related code ===
function getWorldSelectedType() {
  var ie = $('#worldimportexport').get(0).selectedIndex; // 0: import, 1: export, 2: combined
  if (ie === 0)
    return Type.Import;
  if (ie === 1)
    return Type.Export;
  return Type.ImportExportDiff;
}

function getWorldSelectedYear() {
  return parseInt($('#worldyear').get(0).value, 10);
}
// === End helper functions only for world map related code ===

//Function to paint the WorldMap
function drawWorldMap() {
  var year = getWorldSelectedYear();
  var type = getWorldSelectedType();
  var str = TypeString[type];
  $('#worldmapdesc').text(region +", "+ str +" "+ year);
  var view = getCountriesYear(type, region, year);
    /*
    opts.colorAxis = {
      maxValue: 1000 ,
      colors: ['#438094','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#E0D39E','#E0D39E','#E0D39E']
    }
    */
  maps.byCountry.world.draw(view, maps.byCountry.worldOptions);
}

function drawSelectionUSMap(data) {
  maps.byCountry.usa.draw(data, maps.byCountry.usaOptions);
}

function drawCommoditiesUSMap() {
  var comView = getExportCommoditiesYear('ALL', '26', 2009);
  maps.byCommodity.usa.draw(comView, maps.byCommodity.usaOptions);
}
