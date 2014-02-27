function main() {
    $('#tabs').tabs();
    google.setOnLoadCallback(googleReady);
    var commodities_select=[];
    //To manage the commoditie selection
    $('select').on('change', function(event, params) {
        var partial_select=[params.selected,params.deselected];
        if (params.selected!=undefined) {
        	commodities_select.push(params.selected)
        } else {
        	for(var i=0; i<commodities_select.length+1; ++i) {
        		if (commodities_select[i]==params.deselected) {
        			commodities_select.splice(i,1);
        		}
        	}
        }
        console.log(commodities_select)
    });
}

function googleReady() {
    init_import_export();
    init_hscodes();
    worldMap();
    usaMap();
}

function chosenChange(){
	 $('select').on('change', function(event, params) {
    // can now use params.selected and params.deselected
    console.log(peter);
  });
}
$(main);
