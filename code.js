function main() {
    $('#tabs').tabs();
    google.load('visualization', '1', {packages: ['geochart']});
    google.setOnLoadCallback(googleReady);
    var commodities_select=[];
    dojo.ready(chosenDojo);
    //Management of the selection
    $('select').on('change', function(event) {
    var select_object = dojo.byId('select');
    var select_div = dojo.byId('msg');
    var selected_values = [];
    for (var x=0; x<=select_object.length; x++) {
        if (select_object[x] && select_object[x].selected) {
            selected_values.push(select_object[x].value);
        }
    }
     select_div.innerHTML = 'Selected value = ' + selected_values;
     console.log(selected_values);
    });
}

//Function to launch the googleAPI
function googleReady() {
    init_import_export();
    init_hscodes();
    worldMap();
    usaMap();
}

//Function to configure options of chosen-dojo commodities selector
function chosenDojo() {
        //Text to display when hovering the languages in map
        var contentString = '<div class="side-by-side clearfix"><div><em class="title">Commodities</em><select id="select"  data-placeholder="Search or select individual or group commodities" style="width:480px;" class="chzn-select-batch" multiple tabindex="6"><option value=""></option><optgroup label="NFC EAST"><option>Dallas Cowboys</option><option>New York Giants</option><option>Philadelphia Eagles</option><option>Washington Redskins</option></optgroup></select></div></div>'
        select = dojo.byId('commodities_selector');
        select.innerHTML= contentString;

        dojo.query(".chzn-select").chosen();
        dojo.query(".chzn-select-deselect").chosen({allow_single_deselect:true});
        dojo.query(".chzn-select-batch").chosen({batch_select:true});    
    }

$(main);
