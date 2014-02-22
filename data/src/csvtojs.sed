# Regular expression used to convert pipe separated data
sed 's/"/\\"/g' hscodes | sed 's/^\(.*\)|\(.*\)|\(.*\)$/[\1, \2, "\3"],/' > hsjs
