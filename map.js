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
    drawWorldMap()
    var selection = google.visualization.arrayToDataTable([
        ['region', 'selected'],
        [region, region]
    ]);
    maps.byCountry.usa.draw(selection, maps.byCountry.usaOptions);
  });
}
//Function to paint the WorldMap
function drawWorldMap() {
  var ie = $('#worldimportexport').get(0).selectedIndex; // 0: import, 1: export, 2: combined
  var year = parseInt($('#worldyear').get(0).value, 10);
  switch (ie) {
    case 0:
        str = "Imports";
        type = Type.Import;
        break;
    case 1:
        str = "Exports";
        type = Type.Export;
        break;
    default:
        str = "Imports/Exports difference. Negative number means more imports";
        type = Type.ImportExportDiff;
  }
  $('#worldmapdesc').text(region +", "+ year +" "+ str);
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
