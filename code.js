google.load('visualization', '1', {
    packages: ['geochart', 'table','sankey','corechart']
});

// Selected commodities
var select_commodities = [];
var select_name_comm = [];
var group_code = [];
var commSelectedYears = [2012];
var worldSelectedYears = [2012];
var holdExpanded = false;

//main function
function main() {
    $('#tabs').tabs();
    $('#formatcoun').buttonset();
    $('#formatplot').buttonset();
    $('#formatcomm').buttonset();
    //$('.plotbutton:first').toggle();//We show the menu button
    buttonBar();
    changePlot();
    initYearSelect();
    google.setOnLoadCallback(googleReady());
    holdGraph();
    //Initialize the buttons that are initially on
    $('#comm12 .ui-button-text').addClass('buttonselect');
    $('#lBar .ui-button-text').addClass('buttonselect')
    $('#lhistogram .ui-button-text').addClass('buttonselect')
    $('#lpie .ui-button-text').addClass('buttonselect')
    $('#commleftbox').tooltip();
    $('#leftbox').tooltip();
    $('#formatplot').tooltip();
    $('#plotwrapper').tooltip();
    $('#hold').tooltip();
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
    drawSelectionUSMap();
    drawWorldMap();
    drawRawTable();
    drawPieChart(charts.byCommodity.pie,250,320);
    drawHistogram(charts.byCommodity.hist,310,300);
    drawBarChart(charts.byCommodity.bar,440,250);
    $('#worldimportexport').change(onWorldMapDataChanged);
    $('#usimportexport').change(onCommMapDataChanged);
}

function onWorldMapDataChanged() {
  drawWorldMap();
  drawSankeyChart();
}

function onCommMapDataChanged() {
  drawCommoditiesUSMap();
  drawPieChart(charts.byCommodity.pie,250,320);
  drawHistogram(charts.byCommodity.hist,300,200);
  drawBarChart(charts.byCommodity.bar,420,300);
}

function onYearChanged(page) {
    if (page === 'world')
        onWorldMapDataChanged();
    if (page === 'commodities')
        onCommMapDataChanged();
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

    var contentStringCommodities = '<div class="side-by-side clearfix"><select id="comselect"  data-placeholder="Search and select individual or group of commodities" style="width:370px;" class="chzn-select-batch" multiple tabindex="6"><option value=""></option>'+ group_code.join('') +'</optgroup></select></div>';
    select = dojo.byId('commodities_selector');
    select.innerHTML = contentStringCommodities;

    //Chosen-dojo options
    dojo.query(".chzn-select").chosen();
    dojo.query(".chzn-select-deselect").chosen({allow_single_deselect:true});
    dojo.query(".chzn-select-batch").chosen({batch_select:true});

    //Management of the selection
    $('#comselect').on('change', function(event) {
        var select_object = dojo.byId('comselect');
        select_commodities = [];
        select_name_comm = [];
        for (var x=0; x<=select_object.length; x++) {
            if (select_object[x] && select_object[x].selected) {
                var val = select_object[x].value;
                var idxspace = val.indexOf(' ');
                select_commodities.push(val.substr(0, idxspace));
                select_name_comm.push(val.substr(idxspace));
            }
        }
        onCommMapDataChanged();
    });

    //Clear search button
    $('#comclear')
    .button()
    .click(function(e) {
        e.preventDefault();
        selected_values = []
    });
    //Text to fill in the states Selector for International Imports/Exports USA Map
    var contentStringStates = '<div class="side-by-side clearfix"><label for="stateselect">State</label><select id="stateselect"  data-placeholder="Select individual or group of States" style="width:100px;" class="chzn-select-batch" multiple tabindex="6"><option value=""></option><option>Alabama</option><option>Alaska</option><option>Arizona</option><option>Arkansas</option><option>California</option><option>Colorado</option><option>Connecticut</option><option>Delaware</option><option>Florida</option><option>Georgia</option><option>Hawaii</option><option>Idaho</option><option>Illinois</option><option>Indiana</option><option>Iowa</option><option>Kansas</option><option>Kentucky</option><option>Louisiana</option><option>Maine</option><option>Maryland</option><option>Massachusetts</option><option>Michigan</option><option>Minnesota</option><option>Mississippi</option><option>Missouri</option><option>Montana</option><option>Nebraska</option><option>Nevada</option><option>New Hampshire</option><option>New Jersey</option><option>New Mexico</option><option>New York</option><option>North Carolina</option><option>North Dakota</option><option>Ohio</option><option>Oklahoma</option><option>Oregon</option><option>Pennsylvania</option><option>Rhode Island</option><option>South Carolina</option><option>South Dakota</option><option>Tennessee</option><option>Texas</option><option>Utah</option><option>Vermont</option><option>Virginia</option><option>Washington</option><option>West Virginia</option><option>Wisconsin</option><option>Wyoming</option></select></div>';
    select = dojo.byId('state_selector');
    select.innerHTML = contentStringStates;

    //Chosen-dojo options
    dojo.query(".chzn-select").chosen();
    dojo.query(".chzn-select-deselect").chosen({allow_single_deselect:true});
    dojo.query(".chzn-select-batch").chosen({batch_select:true});

    //Management of the selection
    $('#stateselect').on('change', function(event) {
        var select_object = dojo.byId('stateselect');
        var selected_values = [];
        for (var x=0; x<=select_object.length; x++) {
            if (select_object[x] && select_object[x].selected) {
                selected_values.push(select_object[x].value);
            }
        }
    });
}

//Function to monitor the year selection for commodities
function initYearSelect (){
    //Function to check the actual year of selection - deselection
    function checkYear (btn) {
        var y = btn.data('year');
        var chk = btn.is(':checked');
        if (btn.prop('id').substr(3, 2) === 'us') {
            if (chk) {
                commSelectedYears.push(y);
                commSelectedYears.sort();
            } else {
                commSelectedYears.splice(commSelectedYears.indexOf(y), 1);
            }
            onYearChanged('commodities');
        } else {
            if (chk) {
                worldSelectedYears.push(y);
                worldSelectedYears.sort();
            } else {
                worldSelectedYears.splice(worldSelectedYears.indexOf(y), 1);
            }
            onYearChanged('world');
        }
        //Change colors for the buttons when toggling them
        if(commSelectedYears.indexOf(2009) >= 0) $('#comm09 .ui-button-text').addClass('buttonselect');
        else $('#comm09 .ui-button-text').removeClass('buttonselect');
        if (commSelectedYears.indexOf(2010) >= 0) $('#comm10 .ui-button-text').addClass('buttonselect');
        else $('#comm10 .ui-button-text').removeClass('buttonselect');
        if (commSelectedYears.indexOf(2011) >= 0) $('#comm11 .ui-button-text').addClass('buttonselect');
        else $('#comm11 .ui-button-text').removeClass('buttonselect');
        if (commSelectedYears.indexOf(2012) >= 0) $('#comm12 .ui-button-text').addClass('buttonselect');
        else $('#comm12 .ui-button-text').removeClass('buttonselect');
    }
    function setSelectedYears () {
        $.each($('.chkyear'), function(i, o) {
            var b = $(o);
            var sel = ($.inArray(b.data('year'), worldSelectedYears) >= 0);
            if (b.prop('checked') !== sel) {
                b.prop('checked', sel);
                b.button('refresh');
            }
        });
    }
    setSelectedYears();
    $('.chkyear').click(function (e) {
        checkYear($(e.target));
    });
}

//Function to toggle button on hover
function buttonBar(){
    $('.formatplot').click(function(){
        $('.plotbutton').toggle("slow");
    });
}

//Function to get value from Plot buttons and change the plot accordingly
function changePlot(){
    $('.plotbutton').click(function(){
        var id = this.id.split('b')[1];
        $('#'+id).toggle('slow')
        var button_id= this.id + ' .ui-button-text'
        $('#l'+ id + ' .ui-button-text').toggleClass('buttonselect')
    })
}
//Function to attach a graph to the hold square when clicking a graph
function holdGraph(){
    var hold_chart = null;
    var hold_type = '';
    $('#pie').click(function(){
        initHoldCharts();
        hold_chart = charts.byCommodity.hold_pie;
        hold_type = 'pie';
        drawHoldChart(hold_chart,hold_type);
    })
    $('#histogram').click(function(){
        initHoldCharts();
        hold_chart = charts.byCommodity.hold_hist;
        hold_type = 'hist'
        drawHoldChart(hold_chart,hold_type);
    })
    $('#Bar').click(function(){
        initHoldCharts();
        hold_chart = charts.byCommodity.hold_bar;
        hold_type = 'bar'
        drawHoldChart(hold_chart,hold_type);
    })
    $('#hold').click(function(){
        var width = holdExpanded ? 200 : 820,
            height = holdExpanded ? 200 : 290,
            top = holdExpanded ? 90 : 0;
        holdExpanded = !holdExpanded;
        $('#hold').css(
            {'width':width, 'height':height, 'top':top})
        drawHoldChart(hold_chart,hold_type);
    });
    $('#tabviz').dblclick(function(){
        $('#hold').css(
            {'width':200, 'height':200, 'top':90})
        drawHoldChart(hold_chart,hold_type);
    });
}
$(main);
