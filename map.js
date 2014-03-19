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
            width: 800,
            height: 372
        },
        usacomm:null,
        usacommOptions: {
            region: 'US',
            displayMode: 'regions',
            enableRegionInteractivity: 'true',
            resolution: 'provinces',
            legend: false,
            width: 396,
            height: 170
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
  maps.byCommodity.usacomm = new google.visualization.GeoChart(document.getElementById('USselectmapcomm'));
  google.visualization.events.addListener(maps.byCommodity.usacomm, 'regionClick', drawSelectionUSMap);

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

// === End helper functions only for world map related code ===

//Function to paint the WorldMap
function drawWorldMap() {
  var type = getWorldSelectedType();
  var str = TypeString[type];
  var reg = regions.toArray();
  $('#worldmapdesc').text(reg.sort().join(', ') +" "+ str +" "+ worldSelectedYears.join(', '));
  var view = getCountriesYear(type, reg, worldSelectedYears);
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
  maps.byCommodity.usacomm.draw(selection, maps.byCommodity.usacommOptions);
  if (e) {
    onWorldMapDataChanged();
    onCommMapDataChanged();
  }
}

function drawCommoditiesUSMap() {
  var comView = getExportCommoditiesYear('ALL', '26', 2009);
  maps.byCommodity.usa.draw(comView, maps.byCommodity.usaOptions);
}
