var Column = {
  State: 0,
  Rank: 1,
  Hscode: 2, // only by-commodity tables
  Country: 2 // only by-country tables
};

/**
 * Get the db column index for a given year for the per-country tables
 * @param year {Number} the year
 * @param perct {boolean} Optional, if true returns the percentual value. Default: absolute value
 */
function getCountryYearCol(year, perct) {
  switch(year) {
    case 2009: return perct ? 7 : 3;
    case 2010: return perct ? 8 : 4;
    case 2011: return perct ? 9 : 5;
    case 2012: return perct ? 10 : 6;
  }
}
/**
 * Get the db column index for a given year for the commodity tables
 * @param year {Number} the year
 * @param perct {boolean} Optional, if true returns the percentual value. Default: absolute value
 */
function getCommodityYearCol(year, perct) {
  switch(year) {
    case 2009: return perct ? 8 : 4;
    case 2010: return perct ? 9 : 5;
    case 2011: return perct ? 10 : 6;
    case 2012: return perct ? 11 : 7;
  }
}

/**
 * Get all export countries for a given state
 * @param state {String} State to select (e.g. 'AK')
 * @return row-filtered view
 */
function getExportCountries(state) {
  var view = new google.visualization.DataView(stateExportCountries);
  view.setRows(view.getFilteredRows([
    // Filter out current state w/o the "total" rows
    {column: Column.State, value: state},
    {column: Column.Rank, minValue: 1}
  ]));
  return view;
}

/**
 * Filter columns on an existing view
 * @param view {Object} The view to set the visible columns on
 * @param year {Number} The year to filter out
 * @param colidxs{Array} Optional, an array of column indices that need to be present. Default: 2 (Country)
 * @return column-filtered view
 */
function filterCountryViewByYear(view, year, colidxs) {
  colidxs = colidxs || [2];
  colidxs.push(getCountryYearCol(year));
  view.setColumns(colidxs);
  return view;
}

/**
 * Get final view of exports per country for a given state and year
 * @param state {String} State to filter
 * @param year {Number} Year to filter
 * @param raw {boolean} Optional, return only raw data true or w/ textual tooltip (default).
 * @return filtered view
 */
function getExportCountriesYear(state, year, raw) {
  var v = getExportCountries(state);
  var y = getCountryYearCol(year);
  var columns = [2, y];
  if (!raw) {
    columns.push({
      label: 'Years',
      type: 'string',
      role: 'tooltip',
      calc: function(t,r) {
        return 'Year '+year+': '+ t.getValue(r, getCountryYearCol(year));
      }
    });
  }
  return v;
}

/**
 * Return a list of rows matching an hscode category
 * @param t the table to search (DataView)
 * @param c the hscode prefix to match
 */
function getFilteredHscodes(t, c) {
  var i = 0,
      n = t.getNumberOfRows(),
      ret = [];
  for (; i < n; ++i) {
    if ((t.getValue(i, Column.Hscode)).substr(0, c.length) === c
        && t.getValue(i, Column.Rank) > 0) {
      ret.push(i);
    }
  }
  return ret;
}

/**
 * Get exported commodities
 * @param state {String} Optional, state to select (e.g. 'AK')
 * @return row-filtered view
 */
function getExportCommodities(state) {
  var view = new google.visualization.DataView(stateExportCommodities);
  var filter = [{column: Column.Rank, minValue: 1}];
  if (state)
    filter.push({column: Column.State, value: state});
  view.setRows(view.getFilteredRows(filter));
  return view;
}

/**
 * Get final view of exports per commodity for a given state and year
 * @param state {String} State to filter
 * @param hscode {String} Hscode or prefix to filter (default '')
 * @param year {Number} Year to filter
 * @param raw {boolean} Optional, return only raw data true or w/ textual tooltip (default).
 * @return filtered view
 */
function getExportCommoditiesYear(state, hscode, year) {
  var v = getExportCommodities(state);
  var y = getCommodityYearCol(year);
  var columns = [0, y];
  if (!raw) {
    columns.push({
      label: 'Years',
      type: 'string',
      role: 'tooltip',
      calc: function(t,r) {
        return 'Year '+year+': '+ t.getValue(r, getCountryYearCol(year));
      }
    });
  }
  return v;
  
}
