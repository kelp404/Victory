
"""
    minify core.js to core.min.js

    $ cd applicatioin/static
    $ python minifier
"""


from slimit import minify

# read base javascript
base = open('./javascripts/base.min.js', 'r').read()
# read KNotification.js, view_events.js, core.js and minify
notification = open('./coffees/KNotification.js', 'r').read()
core = open('./coffees/core.js', 'r').read()
view_events = open('./coffees/view_events.js', 'r').read()
compressed = minify(notification + core + view_events, mangle=True, mangle_toplevel=True)

# write to the file
f = open('./javascripts/core.min.js', 'w')
f.write(base)
f.write("\n\n")
f.write(compressed)