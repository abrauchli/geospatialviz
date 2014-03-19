var Column = {
    State: 0,
    Rank: 1,
    Hscode: 2, // only by-commodity tables
    Country: 2 // only by-country tables
  },
  Type = {
    Export: 'export',
    Import: 'import',
    ImportExportDiff: 'iediff'
  },
  TypeString = {
    'export': "Exports",
    'import': "Imports",
    'iediff': "Imports/Exports difference. Negative number means more imports"
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
  console.error('Invalid case');
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
  console.error('Invalid case');
}

// ---- Begin Wrapper Functions ----
// Easy usage functions. More advanced filters below these.

/**
 * Get all export countries for a given state
 * @param state {String} State to select (e.g. 'AK')
 * @return row-filtered view
 */
function getExportCountries(state) {
  return getCountries(Type.Export, state);
}
function getImportCountries(state) {
  return getCountries(Type.Import, state);
}
/**
 * Get final view of exports per country for a given state and year
 * @param state {String} State to filter
 * @param year {Number} Year to filter
 * @param raw {boolean} Optional, return only raw data true or w/ textual tooltip (default).
 * @return filtered view
 */
function getExportCountriesYear(state, years, raw) {
  return getCountriesYear(Type.Export, state, years, raw);
}
function getImportCountriesYear(state, years, raw) {
  return getCountriesYear(Type.Import, state, years, raw);
}

/**
 * Get exported commodities
 * @param state {String} Optional, state to select (e.g. 'AK')
 * @return row-filtered view
 */
function getExportCommodities(states) {
  return getCommodities(Type.Export, states);
}
function getImportCommodities(states) {
  return getCommodities(Type.Import, states);
}

/**
 * Get final view of exports per commodity for a given state and year
 * @param state {String} State to filter, pass '' or 'ALL' for all states
 * @param hscodes {Array} Array of hscodes or prefix to filter (default [''])
 * @param years {Array} Years to filter
 * @param raw {boolean} Optional, return only raw data true or w/ textual tooltip (default).
 * @return filtered view
 */
function getExportCommoditiesYear(state, hscodes, years, raw) {
  return getCommoditiesYear(Type.Export, state, hscodes, years, raw);
}
function getImportCommoditiesYear(state, hscodes, years, raw) {
  return getCommoditiesYear(Type.Import, state, hscodes, years, raw);
}

/**
 * Get aggregated commodity export totals for each state
 * @return a view of commodity totals for each state
 */
function getExportCommodityTotals() {
  return getCommodityTotals(Type.Export);
}
function getImportCommodityTotals() {
  return getCommodityTotals(Type.Import);
}

// ---- End Wrapper Functions ----

function getMultivalFilteredRows(view, filters) {
  var rows = [];
  for (var i = 0; i < view.getNumberOfRows(); ++i) {
    var matched = 0;
    $.each(filters, function(k, f) {
      var s = view.getValue(i, f.column);
      if ($.isArray(f.value)) {
        for (var j = 0; j < f.value.length; ++j) {
          if (s === f.value[j]) {
            ++matched;
            break;
          }
        }
      } else if (f.value === s) {
        ++matched;
      } else if ((!f.hasOwnProperty('minValue') || s >= f.minValue)
                 && (!f.hasOwnProperty('maxValue') || s <= f.maxValue)) {
        ++matched;
      }
    });
    if (matched === filters.length)
      rows.push(i);
  }
  return rows;
}

function getCountries(type, states) {
  var view = new google.visualization.DataView(type === Type.Export ? stateExportCountries : stateImportCountries);
  var filters = [{column: Column.Rank, minValue: 1}];
  if (states.length > 0) {
    // Filter out current state w/o the "total" rows
    filters.push({column: Column.State, value: states});
  }
  view.setRows(getMultivalFilteredRows(view, filters));
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

function getCountriesYearUngrouped(type, states, years) {
  function getIEYearCol(y, exports) {
    return (exports ? years.length +2 : 2) + years.indexOf(y);
  }
  var yearCols = [];
  $.each(years, function(k,v) { yearCols.push(getCountryYearCol(v)); });
  var v = (type !== Type.ImportExportDiff)
            ? getCountries(type, states).toDataTable()
            : google.visualization.data.join(
                getCountries(Type.Import, states),
                getCountries(Type.Export, states),
                'full',
                [[Column.State, Column.State],[Column.Country, Column.Country]],
                yearCols,
                yearCols);
  var yearColObjs = [];
  $.each(years, function(k,v) {
    yearColObjs.push({
      column: (type !== Type.ImportExportDiff ? getCountryYearCol(v) : getIEYearCol(v)),
      aggregation: google.visualization.data.sum,
      type: 'number',
      label: v
    });
  });
  if (type === Type.ImportExportDiff) {
    // same game again for joined exports
    $.each(years, function(k,v) {
      yearColObjs.push({
        column: getIEYearCol(v, true),
        aggregation: google.visualization.data.sum,
        type: 'number',
        label: 'Exports ' + v
      });
    });
  }
  return v;
}

function getCountriesYear(type, states, years) {
  function getIEYearCol(y, exports) {
    return (exports ? years.length +2 : 2) + years.indexOf(y);
  }
  var yearCols = [];
  $.each(years, function(k,v) { yearCols.push(getCountryYearCol(v)); });
  var v = (type !== Type.ImportExportDiff)
            ? getCountries(type, states)
            : new google.visualization.DataView(
                google.visualization.data.join(
                  getCountries(Type.Import, states),
                  getCountries(Type.Export, states),
                  'full',
                  [[Column.State, Column.State],[Column.Country, Column.Country]],
                  yearCols,
                  yearCols)
              );
  if (states.length !== 1) {
    var yearColObjs = [];
    $.each(years, function(k,v) {
      yearColObjs.push({
        column: (type !== Type.ImportExportDiff ? getCountryYearCol(v) : getIEYearCol(v)),
        aggregation: google.visualization.data.sum,
        type: 'number',
        label: v
      });
    });
    if (type === Type.ImportExportDiff) {
      // same game again for joined exports
      $.each(years, function(k,v) {
        yearColObjs.push({
          column: getIEYearCol(v, true),
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: 'Exports ' + v
        });
      });
    }
    var colCountry = (type === Type.ImportExportDiff ? 1 : Column.Country);
    if (v.getColumnLabel(colCountry) !== "Country") throw new Error("Wrong ctry index");
    var gdt = new google.visualization.data.group(v.toDataTable(), [colCountry], yearColObjs);
    v = new google.visualization.DataView(gdt);
  }

  // 1st nondiff State, Rank, Country, ...
  // 1st diff    State, Country, ...
  // 2st nondiff Country, ...
  // 2st diff    Country, ...
  var offset = 0; // country column offset
  if (states.length === 1) {
    if (type === Type.ImportExportDiff)
      offset = 1;
    else
      offset = 2;
  }
  if (v.getColumnLabel(offset) !== "Country")
    throw new Error("Wrong country idx");

  var columns = [offset];
  columns.push({
    label: 'Years',
    type: 'number',
    role: 'data',
    calc: function(t,r) {
      var sum = 0;
      $.each(yearCols, function(k,v) {
        if (type !== Type.ImportExportDiff) {
          sum += t.getValue(r, (states.length !== 1 ? k+offset+1 : v));
        } else {
          var i = t.getValue(r, k+offset+1);
          var e = t.getValue(r, years.length + k+offset+1);
          sum += (e-i);
        }
      });
      return sum;
    }
  });
  if (type !== Type.ImportExportDiff) {
    columns.push({
      label: 'Tooltip',
      type: 'string',
      role: 'tooltip',
      calc: function(t,r) {
        var ret = [];
        var sum = 0;
        $.each(yearCols, function(k,v) {
          var val = t.getValue(r, (states.length !== 1 ? k+offset+1 : v));
          sum += val;
          ret.push(years[k]+': '+ val);
        });
        if (years.length > 1)
          ret.push("Total: "+ sum);
        return ret.join("\n");
      }
    });

  } else {
    columns.push({
      label: 'Tooltip',
      type: 'string',
      role: 'tooltip',
      calc: function(t,r) {
        var ret = [];
        var sum = 0;
        $.each(years, function(k,y) {
          var i = t.getValue(r, offset+k+1);
          var e = t.getValue(r, offset+years.length+k+1);
          sum += (e-i);
          ret.push(y+' exp: '+ (e+0));
          ret.push(y+' imp: '+ (i+0));
          ret.push(y+' diff: '+ (e-i));
        });
        if (years.length > 1)
          ret.push("Total diff: "+ sum);
        return ret.join("\n");
      }
    });
  }
  v.setColumns(columns);
  return v;
}

/**
 * Filters a view with a matching hscode category
 * @param table the table to search (DataView)
 * @param hscodes {Array} the hscode prefixes to match
 */
function filterHscodes(table, hscodes) {
  var i = 0,
      n = table.getNumberOfRows(),
      filter = [];
  for (; i < n; ++i) {
    for (var j = 0; j < hscodes.length; ++j) {
      if ((table.getValue(i, Column.Hscode)).indexOf(hscodes[j]) === 0) {
        filter.push(i);
        break;
      }
    }
  }
  table.setRows(filter);
}

function getCommodityTotals(type) {
  var view = new google.visualization.DataView(type === Type.Export ? stateExportCommodities : stateImportCommodities);
  var filter = [{column: Column.Rank, value: -2}];
  view.setRows(view.getFilteredRows(filter));
  return view;
}

function getCommodities(type, states) {
  var view = new google.visualization.DataView(type === Type.Export ? stateExportCommodities : stateImportCommodities);
  var filter = [{column: Column.Rank, minValue: 1}];
  if (states.length > 0)
    filter.push({column: Column.State, value: states});
  view.setRows(getMultivalFilteredRows(view, filter));
  return view;
}

function getStateAggregateCommoditiesYears(type, states, hscodes, years, raw) {
  var t = getCommoditiesYear(type, states, hscodes, years, true).toDataTable();
  t.sort(Column.State);
  // Table with State, years...
  var i = 1;
  while (i < t.getNumberOfRows()) {
    if (t.getValue(i, Column.State) === t.getValue(i-1, Column.State)) {
      for (var j = 0; j < t.getNumberOfColumns(); ++j) {
        if (t.getColumnType(j) !== 'number')
          continue;
        t.setValue(i-1, j, t.getValue(i-1, j) + t.getValue(i, j));
      }
      t.removeRow(i);
    } else {
      ++i;
    }
  }
  if (!raw) {
    var columns = [Column.State];
    var offset = 0;
    columns.push({
      label: TypeString[type],
      type: 'number',
      role: 'data',
      calc: function(t, r) {
        var sum = 0;
        $.each(years, function(k,v) {
          sum += t.getValue(r, k+offset+1);
        });
        return sum;
      }
    });
    columns.push({
      label: 'Tooltip',
      type: 'string',
      role: 'tooltip',
      calc: function(t, r) {
        var ret = [];
        var sum = 0;
        $.each(years, function(k,v) {
          var val = t.getValue(r, k+offset+1);
          sum += val;
          ret.push(years[k]+': '+ val);
        });
        if (years.length > 1)
          ret.push("Total: "+ sum);
        return ret.join("\n");
      }
    });
    v = new google.visualization.DataView(t);
    v.setColumns(columns);
    return v;
  }
  return new google.visualization.DataView(t);
}

function getCommoditiesYear(type, states, hscodes, years, raw) {
  if (states == 'ALL')
    states = [];
  var v = getCommodities(type, states);

  if (hscodes.length > 0) {
    v = new google.visualization.DataView(v.toDataTable());
    filterHscodes(v, hscodes);
  }
  var yearCols = [];
  $.each(years, function(k,v) { yearCols.push(getCommodityYearCol(v)); });
  var columns = [Column.State];
  if (!raw) {
    var offset = 4;
    columns.push({
      label: TypeString[type],
      type: 'number',
      role: 'data',
      calc: function(t, r) {
        var sum = 0;
        $.each(yearCols, function(k,v) {
          sum += t.getValue(r, v);
        });
        return sum;
      }
    });
    columns.push({
      label: 'Tooltip',
      type: 'string',
      role: 'tooltip',
      calc: function(t, r) {
        var ret = [];
        var sum = 0;
        $.each(yearCols, function(k,v) {
          var val = t.getValue(r, v);
          sum += val;
          ret.push(years[k]+': '+ val);
        });
        if (years.length > 1)
          ret.push("Total: "+ sum);
        return ret.join("\n");
      }
    });
  } else {
    columns = columns.concat(yearCols);
  }
  v.setColumns(columns);
  return v;
}
