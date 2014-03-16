var maps = {
    byCountry: {
        usa: null,
        usaOptions: {
            region: 'US',
            displayMode: 'regions',
            enableRegionInteractivity: 'true',
            resolution: 'provinces',
            legend: false,
            width: 300,
            height: 200
        },
        world: null,
        worldOptions: {
            width: 900,
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
            colorAxis: {colors: ['#F0FFC2', '#3D4C0F']},
            legend: false,
            width: 700,
            height: 372
        }
    }
};
var regions = {
  'AK': true,
  toArray: function() {
    var a = []
    $.each(this, function(k, v) { if (!$.isFunction(v)) a.push(k); });
    return a;
  }
};

function initMaps() {
  // Commodity Maps
  maps.byCommodity.usa = new google.visualization.GeoChart(document.getElementById('USAmap'));
  google.visualization.events.addListener(maps.byCommodity.usa, 'regionClick', function(eventData) {
    // TODO
  });

  // Country Maps
  maps.byCountry.world = new google.visualization.GeoChart(document.getElementById('worldmap'));
  maps.byCountry.usa = new google.visualization.GeoChart(document.getElementById('USselectmap'));
  google.visualization.events.addListener(maps.byCountry.usa, 'regionClick', drawSelectionUSMap);
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
  var reg = regions.toArray();
  $('#worldmapdesc').text(reg.sort().join(', ') +", "+ str +" "+ year);
  var view = getCountriesYear(type, reg, year);
    /*
    opts.colorAxis = {
      maxValue: 1000 ,
      colors: ['#438094','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#DE3403','#E0D39E','#E0D39E','#E0D39E']
    }
    */
  maps.byCountry.world.draw(view, maps.byCountry.worldOptions);
}

function drawSelectionUSMap(e) {
  if (e) {
    var reg = e.region.substr(3,5);
    if (regions[reg]) {
        delete regions[reg];
        // TODO: eliminate the selected elemented in the search bar.
    } else {
        regions[reg] = true;
    }
  }
  var selection = google.visualization.arrayToDataTable([
      ['region', 'selected']
  ]);
  $.each(regions, function(k,v) {
    selection.addRow([k, k]);
  });
  maps.byCountry.usa.draw(selection, maps.byCountry.usaOptions);
  if (e) {
    onWorldMapDataChanged();
  }
}

function drawCommoditiesUSMap() {
  var comView = getExportCommoditiesYear('ALL', '26', 2009);
  maps.byCommodity.usa.draw(comView, maps.byCommodity.usaOptions);
}
