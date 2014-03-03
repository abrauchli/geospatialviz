//variable for the groups of chosenDojo selector
var group_code = [];
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

//Function to configure options of chosen-dojo commodities selector and fill in the data to select dynamically
function chosenDojo() {
        //Text to display when hovering the languages in map
        for(var i=0; i<commodities.hscodes.length; ++i) {
            //If it is a group code
            if (commodities.hscodes[i].code == 0) { 
                group_code.push('<optgroup label= \u0022' + commodities.hscodes[i].group + ' ' + commodities.hscodes[i].commodity +'\u0022>');
            }
            //If it is a two digit code
            else {
                //if (commodities.hscodes[i].code == 2) {
                    //We set the groups
                    var group = parseInt(commodities.hscodes[i].group.substring(0,2))
                    //Group 1
                    if (group<6) {
                        var text = group_code[0] + '<option>' + commodities.hscodes[i].group + ' ' + commodities.hscodes[i].commodity + '<option>'
                        group_code[0]=text
                    }
                  //Group 2
                    if (group>5 && group <16) {
                        var text = group_code[1] + '<option>' + commodities.hscodes[i].group + ' ' + commodities.hscodes[i].commodity + '<option>'
                        group_code[1]=text
                    }
                    //Group 3
                    if (group>15 && group <25) {
                        var text = group_code[2] + '<option>' + commodities.hscodes[i].group + ' ' + commodities.hscodes[i].commodity + '<option>'
                        group_code[2]=text
                    }
                    //Group 4
                    if (group>24 && group <28) {
                        var text = group_code[3] + '<option>' + commodities.hscodes[i].group + ' ' + commodities.hscodes[i].commodity + '<option>'
                        group_code[3]=text
                    }
                    //Group 5
                    if (group>27 && group <39) {
                        var text = group_code[4] + '<option>' + commodities.hscodes[i].group + ' ' + commodities.hscodes[i].commodity + '<option>'
                        group_code[4]=text
                    }
                    //Group 6
                    if (group>38 && group <40) {
                        var text = group_code[5] + '<option>' + commodities.hscodes[i].group + ' ' + commodities.hscodes[i].commodity + '<option>'
                        group_code[5]=text
                    }
                    //Group 7
                    if (group>39 && group <44) {
                        var text = group_code[6] + '<option>' + commodities.hscodes[i].group + ' ' + commodities.hscodes[i].commodity + '<option>'
                        group_code[6]=text
                    }
                    //Group 8
                    if (group>43 && group <50) {
                        var text = group_code[7] + '<option>' + commodities.hscodes[i].group + ' ' + commodities.hscodes[i].commodity + '<option>'
                        group_code[7]=text
                    }
                    //Group 9
                    if (group>49 && group <64) {
                        var text = group_code[8] + '<option>' + commodities.hscodes[i].group + ' ' + commodities.hscodes[i].commodity + '<option>'
                        group_code[8]=text
                    }
                    //Group 10
                    if (group>63 && group <68) {
                        var text = group_code[9] + '<option>' + commodities.hscodes[i].group + ' ' + commodities.hscodes[i].commodity + '<option>'
                        group_code[9]=text
                    }
                    //Group 11
                    if (group>67 && group <72) {
                        var text = group_code[10] + '<option>' + commodities.hscodes[i].group + ' ' + commodities.hscodes[i].commodity + '<option>'
                        group_code[10]=text
                    }
                    //Group 12
                    if (group>71 && group <84) {
                        var text = group_code[11] + '<option>' + commodities.hscodes[i].group + ' ' + commodities.hscodes[i].commodity + '<option>'
                        group_code[11]=text
                    }
                    //Group 13
                    if (group>83 && group <86) {
                        var text = group_code[12] + '<option>' + commodities.hscodes[i].group + ' ' + commodities.hscodes[i].commodity + '<option>'
                        group_code[12]=text
                    }
                    //Group 14
                    if (group>85 && group <90) {
                        var text = group_code[13] + '<option>' + commodities.hscodes[i].group + ' ' + commodities.hscodes[i].commodity + '<option>'
                        group_code[13]=text
                    }
                    //Group 15
                    if (group>89 && group <98) {
                        var text = group_code[14] + '<option>' + commodities.hscodes[i].group + ' ' + commodities.hscodes[i].commodity + '<option>'
                        group_code[14]=text
                    }
                    //Group 16
                    if (group>97 && group <100) {
                        var text = group_code[15] + '<option>' + commodities.hscodes[i].group + ' ' + commodities.hscodes[i].commodity + '<option>'
                        group_code[15]=text
                    }
                //}
            }
        }
        console.log(group_code);
        var contentString = '<div class="side-by-side clearfix"><div><em class="title">Commodities</em><select id="select"  data-placeholder="Search or select individual or group commodities" style="width:475px;" class="chzn-select-batch" multiple tabindex="6"><option value=""></option>'+ group_code[0] +  group_code[1] + group_code[2] +  group_code[3] + group_code[4] +  group_code[5] + group_code[6] +  group_code[7] + group_code[8] +  group_code[9] + group_code[10] +  group_code[11] + group_code[12] +  group_code[13] + group_code[14] +  group_code[15] +'</optgroup></select></div></div>'
        select = dojo.byId('commodities_selector');
        select.innerHTML= contentString;

        dojo.query(".chzn-select").chosen();
        dojo.query(".chzn-select-deselect").chosen({allow_single_deselect:true});
        dojo.query(".chzn-select-batch").chosen({batch_select:true});    
    }

$(main);
