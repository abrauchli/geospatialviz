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
        dojo.query(".chzn-select").chosen();
        dojo.query(".chzn-select-deselect").chosen({allow_single_deselect:true});
        dojo.query(".chzn-select-batch").chosen({batch_select:true});          
    }

$(main);
