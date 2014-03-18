 google.load("visualization", "1", {packages:["corechart"]});
  google.setOnLoadCallback(start);
  
  var globalColumnFields = [5]; // each column you want to feed, will be used by the chart type you dictate, each chart can only take certain amount. 
  var globalEorI = 2;
  var chartType = "piechart";
  var state = "AK";
  var descriptCol = 3;
  /*
  chart data point amounts:
  histogram = 1 
  Pie/Donut chart = 1
  column bar  = 3 data points

  column titles for reference:
  "State", "Rank", "Country", "2009 value", "2010 value", "2011 value", "2012 value", "2009 % share", "2010 % share", "2011 % share", "2012 % share", "% change 11-12 share"
	
  */
  
  
  /*function driver()
  {
  // THIS IS A DRIVER FOR TESTING PURPOSES
  alert("Enter State Initials, columns you wish to display, and finally type of chart");
  state = prompt("Enter State Initials... Al for Alabama, etc");
  
  globalEorI = prompt("Enter Commodity E/I (1/2) or Country E/I (4/3) ");
  
  var tempArray = new Array();
  var temp;
  for(var a = 0; a < 5; a ++)
  {
  temp = prompt("Enter column number or -1 to break");
	if (temp === '-1') break;
	tempArray[a] = parseInt(temp);
  }
  globalColumnFields = tempArray;
  
  
  
  start(); // if you delete this change onloadcallback to start
  }
  */
  
  
  function start() { // global function
   init_import_export(); // initialize all values
  var filterNumber = 0;  
  var chart = assignType(); // assigns the type the container will have based on the chartType variable above
  
  
  // choosing which to data table data will be set to
	var data;
	if(globalEorI === 1) // commodity exports
	{data = stateExportCommodities;}
	if(globalEorI === 2) // commodity imports
	{data = stateImportCommodities;	}
	if(globalEorI === 3) // country imports
	{data = stateImportCountries;}
	if(globalEorI === 4) // country exports
	{data = stateExportCountries;}
	// end of choosing
	
	

	var options = {
	  title: state
	};
	
	var zTop = modData(); // just a temporary variable
	
	chart.draw(zTop, options);
	
	
	
	
	
	
	
	
	// ##################  call functions bellow ##################
	
	
	function modData()
	{
	var tempTable = new google.visualization.DataTable();
	var temp; 
	
	tempTable.addColumn('string', 'description'); 
	for(var a= 0; a < globalColumnFields.length; a ++)
	{
	
	tempTable.addColumn('number', data.getColumnLabel(globalColumnFields[a]) ); //adds based on the "headeR" at the top of each init 
	}
	
	// end of initializing the tempTable
	
	 var tArray =  filterArray( createArray(), filterNumber);
	 
	 
	 //document.write(data.getColumnLabel(3));
	tempTable.addRows(tArray);
	
	return tempTable;
	};
	
		
	
	function assignType()
	{
	if( chartType === "histogram")
	{
	filterNumber = 1;
	return new google.visualization.Histogram(document.getElementById('testingBox'));
	}
	if( chartType === "piechart")
	{
	filterNumber = 1;
	return new google.visualization.PieChart(document.getElementById('testingBox'));
	}
	};
	
	function descriptionLook()
	{
	if(globalEorI === 1)
	return 3;
	if(globalEorI === 3)
	return 2;
	if(globalEorI === 4)
	return 2;
	if(globalEorI === 2)
	return 3;
	return -1;
	
	}
	
	
	/*
	finds the "start" point after given state's initials, export/import info
	*/
	function getStart()
	{
	for(var a = 0; a < data.getNumberOfRows(); a ++)
	{
	if(data.getValue(a, 0) === state && data.getValue(a, 1) === 1) return a;
	}
	return -1;
	}
	
	/*
	creates a pure conversion of the dataView represented as a nested array, use filter array in order to get the 
	*/
	function createArray()
	{
	var importArray = new Array();
	var nestedArray = new Array();
	var index = 0;
	
	var startingPoint = 0; // where we will start the point from based on parameters at start
	startingPoint = getStart(); 
	//document.write(startingPoint);
	if(startingPoint === -1) document.write("Erorr at func: getStart()");
	
	for(var a= startingPoint ; a < startingPoint + 25 ; a++) //iterate through data view and add what user chose into an array
	{
	nestedArray = new Array();
		for(var b= 0; b < data.getNumberOfColumns(); b++)
		{
			nestedArray[b] = data.getValue(a, b);
		}
		importArray[index] = nestedArray;
		index ++; // needed because of the way we skip using a
	}
	
	return importArray;
	};
	
	//trims down the created array to suite the required size based on requirements of the current graph being drawn
	function filterArray(importArray, size)
	{
	var convertedArray = new Array();
	var nestedArray = new Array();
	var temp = 0;
	
	for(var a= 0 ; a < importArray.length; a++)
	{
	nestedArray = new Array();
		//// adding the country 
		nestedArray[0] = importArray[a][descriptionLook()];
		//// adding country
		for(var b= 0 ; b< size; b++)
		{
			temp = globalColumnFields[b]; // we grab only the needed amount of data from global column fields... + the country label
			nestedArray[b+1] = importArray[a][temp];
		}
	convertedArray[a] = nestedArray;
	}
	
	return convertedArray;
	};
	
	
	
  };