#!/usr/bin/env python
from __future__ import print_function
import urllib2
import re
import sys

for i in range(1, 16):
    print ('Fetching category '+str(i), file=sys.stderr)
    response = urllib2.urlopen('http://www.foreign-trade.com/reference/hscode.cfm?cat='+ str(i))
    doc = response.readlines()

    for line in doc:
        if 'hscode.cfm?code=' in line:
            m = re.search('code=(\d{2}).*&nbsp;(.*)</B><BR>', line)
            if m:
                print ('2|' + m.group(1) + '|' + m.group(2))
                continue
            m = re.search('code=(\d{4}).*&nbsp;(.*)<BR>', line)
            code = m.group(1)
            print ('4|' + code + '|' + m.group(2))
            print ('Fetching page for code '+ code, file=sys.stderr)
            rspcode = urllib2.urlopen('http://www.foreign-trade.com/reference/hscode.cfm?code='+ code)
            codedoc = rspcode.readlines()
            for l in codedoc:
                m = re.search('<B>(\d{6})</B> &nbsp;(.*)<BR>', l)
                if m:
                    hscode = m.group(1)
                    hsdesc = m.group(2)
                    print ('6|' + hscode + '|' + hsdesc)
