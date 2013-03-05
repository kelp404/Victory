
"""
    jc provides compiling coffee script and minifying .js files.

    $ cd applicatioin/static
    $ python jc
"""

import os
from subprocess import Popen
from slimit import minify

# read base javascript
base = open('./javascripts/base.min.js', 'r').read()

# compile coffee script
p = Popen(['coffee', '-c', 'coffees'])
p.wait()

# get .js file list
js_files = ['./coffees/' + f for f in os.listdir('./coffees/') if f.endswith(".js")]

# read .js files
file_data = ''.join([open(x, 'r').read() for x in js_files])

# minify
compressed = minify(file_data, mangle=True, mangle_toplevel=True)

# write to the file
f = open('./javascripts/core.min.js', 'w')
f.write(base)
f.write(compressed)

# remove .js files
[os.remove(x) for x in js_files]