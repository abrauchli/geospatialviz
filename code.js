//variable for the groups of chosenDojo selector
var group_code = [];
//Initial value for region
region='AK'
//main function
function main() {
    $('#tabs').tabs();
    google.load('visualization', '1', {packages: ['geochart']});
    google.setOnLoadCallback(googleReady(region));
    var commodities_select=[];
    dojo.ready(chosenDojo);
}

//Function to launch the googleAPI
function googleReady(region) {
    init_import_export();
    init_hscodes();
    worldMap(region);
    usaMap();
}

//Function to configure options of chosen-dojo commodities selector and fill in the data to select dynamically
function chosenDojo() {
        //Text to display when hovering the languages in map
        for(var i=0; i<commodities.hscodes.length; ++i) {
            //If it is a group code
            if (commodities.hscodes[i].code == 0) { 
                group_code.push('<optgroup label= \u0022' + commodities.hscodes[i].group + ' ' + commodities.hscodes[i].commodity +'\u0022>');
            } else {
                //If it is a two digit code
                var group = parseInt(commodities.hscodes[i].group.substring(0,2))
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
        //console.log(group_code);
        var contentString = '<div class="side-by-side clearfix"><div><em class="title">Commodities</em><select id="select"  data-placeholder="Search or select individual or group commodities" style="width:475px;" class="chzn-select-batch" multiple tabindex="6"><option value=""></option>'+ group_code[0] +  group_code[1] + group_code[2] +  group_code[3] + group_code[4] +  group_code[5] + group_code[6] +  group_code[7] + group_code[8] +  group_code[9] + group_code[10] +  group_code[11] + group_code[12] +  group_code[13] + group_code[14] +  group_code[15] +'</optgroup></select></div></div>';
        select = dojo.byId('commodities_selector');
        select.innerHTML = contentString;

        //Chosen-dojo options
        dojo.query(".chzn-select").chosen();
        dojo.query(".chzn-select-deselect").chosen({allow_single_deselect:true});
        dojo.query(".chzn-select-batch").chosen({batch_select:true});

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

$(main);
