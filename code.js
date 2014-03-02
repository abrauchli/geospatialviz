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

        //Text to display when hovering the languages in map
        var contentString =  '<div class="side-by-side clearfix"><div><em class="title">Commodities</em><select id="select" data-placeholder="Search or select individual or group commodities" style="width: 480px; display: none;" class="chzn-select-batch chzn-done" multiple="" tabindex="-1"><option value=""></option><optgroup label="NFC EAST"><option>Dallas Cowboys</option><option>New York Giants</option><option>Philadelphia Eagles</option><option>Washington Redskins</option></optgroup></select><div id="select_chzn" class="chzn-container chzn-container-multi chzn-container-active" style="width: 480px"><ul class="chzn-choices"><li id="select_chzn_c_2" class="search-choice"><span>Dallas Cowboys</span><a href="#" class="search-choice-close" rel="2"></a></li><li id="select_chzn_c_3" class="search-choice"><span>New York Giants</span><a href="#" class="search-choice-close" rel="3"></a></li><li id="select_chzn_c_4" class="search-choice"><span>Philadelphia Eagles</span><a href="#" class="search-choice-close" rel="4"></a></li><li id="select_chzn_c_5" class="search-choice"><span>Washington Redskins</span><a href="#" class="search-choice-close" rel="5"></a></li><li class="search-field"><input type="text" value="Search or select individual or group commodities" class="default" autocomplete="off" style="width: 25px;" tabindex="6"></li></ul><div class="chzn-drop" style="left: 0px; width: 478px; top: 57px;"><ul class="chzn-results"><li id="select_chzn_g_1" class="group-result-selectable active-result highlighted" style="display: none;"><div>NFC EAST</div></li><li id="select_chzn_o_2" class="group-option result-selected" style="">Dallas Cowboys</li><li id="select_chzn_o_3" class="group-option result-selected" style="">New York Giants</li><li id="select_chzn_o_4" class="group-option result-selected" style="">Philadelphia Eagles</li><li id="select_chzn_o_5" class="group-option result-selected" style="">Washington Redskins</li></ul></div></div></div></div>';
        var contentString2 = '<div class="side-by-side clearfix"><div><em class="title">Commodities</em><select id="select" data-placeholder="Search or select individual or group commodities" style="width: 480px; display: none;" class="chzn-select-batch chzn-done" multiple="" tabindex="-1"><option value=""></option><optgroup label="NFC EAST"><option>Dallas Cowboys</option><option>New York Giants</option><option>Philadelphia Eagles</option><option>Washington Redskins</option></optgroup></select><div id="select_chzn" class="chzn-container chzn-container-multi" style="width: 480px"><ul class="chzn-choices"><li class="search-field"><input type="text" value="Search or select individual or group commodities" class="default" autocomplete="off" style="width: 355px;" tabindex="6"></li></ul><div class="chzn-drop" style="left: -9000px; width: 478px; top: 30px;"><ul class="chzn-results"><li id="select_chzn_g_1" class="group-result-selectable active-result" style="display: block;"><div>NFC EAST</div></li><li id="select_chzn_o_2" class="group-option active-result" style="">Dallas Cowboys</li><li id="select_chzn_o_3" class="group-option active-result" style="">New York Giants</li><li id="select_chzn_o_4" class="group-option active-result" style="">Philadelphia Eagles</li><li id="select_chzn_o_5" class="group-option active-result" style="">Washington Redskins</li></ul></div></div></div></div>';
        select = dojo.byId('commodities_selector');
        select.innerHTML= contentString;          
    }

$(main);
