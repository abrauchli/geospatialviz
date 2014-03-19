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

function getWorldSelectedType() {
  return getSelectedType('#worldimportexport');
}

function getCommSelectedType() {
  return getSelectedType('#usimportexport');
}

function getSelectedType(id) {
  var ie = $(id).get(0).selectedIndex; // 0: import, 1: export, 2: combined
  if (ie === 0)
    return Type.Import;
  if (ie === 1)
    return Type.Export;
  return Type.ImportExportDiff;
}

//Function to paint the WorldMap
function drawWorldMap() {
  var type = getWorldSelectedType();
  var str = TypeString[type];
  var reg = regions.toArray();
  $('#worldmapdesc').text(reg.sort().join(', ') +" "+ str +" "+ worldSelectedYears.join(', ') + " [Mio USD]");
  var view;
  if (worldSelectedYears.length === 0)
    view = new google.visualization.arrayToDataTable([['region','data']]);
  else
    view = getCountriesYear(type, reg, worldSelectedYears);
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
  var type = getCommSelectedType();
  var str = TypeString[type];
  var reg = regions.toArray();
  var commtext = '';
  if (select_commodities.length > 1) {
    var coms = select_commodities.join(', ');
    if (coms.length > 30 && coms.indexOf(',', 30) > 30)
      coms = coms.substr(0, coms.indexOf(',', 30)+2) + '...';
    commtext = ', Commodity codes starting with '+ coms;
  } else if (select_commodities.length === 1) {
    if (select_commodities[0].length < 6)
      commtext = ', Commodity code starting with '+ select_commodities[0];
    else
      commtext = ', Commodity code '+ select_commodities[0];
  }
  $('#commmapdesc').text(reg.sort().join(', ') +" "+ str +" "+ commSelectedYears.join(', ') + commtext + " [Mio USD]");
  var view;
  if (commSelectedYears.length === 0)
    view = new google.visualization.arrayToDataTable([['region','data']]);
  else
    view = getStateAggregateCommoditiesYears(type, reg, select_commodities, commSelectedYears);

  maps.byCommodity.usa.draw(view, maps.byCommodity.usaOptions);
}
