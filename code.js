//variable for the groups of chosenDojo selector
var group_code = [];
//Initial value for region
var region='AK';
google.load('visualization', '1', {packages: ['geochart', 'table','sankey']});

//main function
function main() {
    $('#tabs').tabs();
    google.setOnLoadCallback(googleReady());
    $('#check').button();
    $('#format').buttonset();
}

//Function to launch the googleAPI
function googleReady() {
    init_import_export();
    init_hscodes();
    dojo.ready(initCommoditiesSelector);
    initMaps();
    initCharts();
    drawCommoditiesUSMap();
    drawSankeyChart();
    //Initial value for the mapUI
    var initial_data = google.visualization.arrayToDataTable([
        ['region', 'selected'],
        [region, region]
    ]);
    drawSelectionUSMap(initial_data);
    drawWorldMap();
    drawRawTable();
    $('#worldimportexport').change(onWorldMapDataChanged);
    $('#worldyear').change(onWorldMapDataChanged);
}

function onWorldMapDataChanged() {
  drawWorldMap();
  drawSankeyChart();
}

function drawRawTable() {
    var d = [stateExportCountries, stateImportCountries, stateExportCommodities, stateImportCommodities],
        table = new google.visualization.Table(document.getElementById('tbldata'));
    $('#tabdataselect').change(function(e) {
        var v = e.target.selectedIndex;
        if (!v)
            return;
        table.draw(d[v-1], {showRowNumber: true});
    });
}

//Function to configure options of chosen-dojo commodities selector and fill in the data to select dynamically
function initCommoditiesSelector() {
    //Text to fill in the CommoditiesSelector Search bar
    for(var i=0; i<commodities.hscodes.length; ++i) {
        //If it is a group code
        if (commodities.hscodes[i].code == 0) {
            group_code.push('<optgroup label="' + commodities.hscodes[i].group + ' ' + commodities.hscodes[i].commodity +'">');
        } else {
            //If it is a two digit code
            var group = parseInt(commodities.hscodes[i].group.substring(0,2), 10);
            var g;
            if (group<6) g = 0;
            else if (group>5 && group <16) g = 1;
            else if (group>15 && group <25) g = 2;
            else if (group>24 && group <28) g = 3;
            else if (group>27 && group <39) g = 4;
            else if (group>38 && group <40) g = 5;
            else if (group>39 && group <44) g = 6;
            else if (group>43 && group <50) g = 7;
            else if (group>49 && group <64) g = 8;
            else if (group>63 && group <68) g = 9;
            else if (group>67 && group <72) g = 10;
            else if (group>71 && group <84) g = 11;
            else if (group>83 && group <86) g = 12;
            else if (group>85 && group <90) g = 13;
            else if (group>89 && group <98) g = 14;
            else if (group>97) g = 15;
            group_code[g] = group_code[g] + '<option>' + commodities.hscodes[i].group + ' ' + commodities.hscodes[i].commodity + '<option>';
        }
    }

    var contentStringCommodities = '<div class="side-by-side clearfix"><div><label for="comselect">Commodities</label><select id="comselect"  data-placeholder="Search or select individual or group commodities" style="width:475px;" class="chzn-select-batch" multiple tabindex="6"><option value=""></option>'+ group_code.join('') +'</optgroup></select></div></div>';
    select = dojo.byId('commodities_selector');
    select.innerHTML = contentStringCommodities;

    //Chosen-dojo options
    dojo.query(".chzn-select").chosen();
    dojo.query(".chzn-select-deselect").chosen({allow_single_deselect:true});
    dojo.query(".chzn-select-batch").chosen({batch_select:true});

    //Management of the selection
    $('comselect').on('change', function(event) {
    var select_object = dojo.byId('comselect');
    var selected_values = [];
    for (var x=0; x<=select_object.length; x++) {
        if (select_object[x] && select_object[x].selected) {
            selected_values.push(select_object[x].value);
        }
    }
    });

    //function removeSelect(selected_values) {
    // What's that ^^ for?
    $('#comclear')
    .button()
    .click(function(e) {
        e.preventDefault();
        console.log('clik');
        selected_values = []
    });
    //}
    //Text to fill in the states Selector for International Imports/Exports USA Map
    var contentStringStates = '<div class="side-by-side clearfix"><div><label for="stateselect">Commodities</label><select id="stateselect"  data-placeholder="Search or select individual or group commodities" style="width:200px;" class="chzn-select-batch" multiple tabindex="6"><option value=""></option><option>Alaska</option></select></div></div>';
    select = dojo.byId('state_selector');
    select.innerHTML = contentStringStates;

    //Chosen-dojo options
    dojo.query(".chzn-select").chosen();
    dojo.query(".chzn-select-deselect").chosen({allow_single_deselect:true});
    dojo.query(".chzn-select-batch").chosen({batch_select:true});

    //Management of the selection
    $('stateselect').on('change', function(event) {
    var select_object = dojo.byId('stateselect');
    var selected_values = [];
    for (var x=0; x<=select_object.length; x++) {
        if (select_object[x] && select_object[x].selected) {
            selected_values.push(select_object[x].value);
        }
    }
    });

}

$(main);
