
"""
    binding.py provides binding js, css files.

    $ cd applicatioin/static
    $ python binding
"""

import os


# binding javascript
js_files = ['./javascript/' + f for f in os.listdir('./javascript/') if f.endswith(".min.js") and not f.endswith("site.min.js")]
js_files.extend(['./coffeescript/' + f for f in os.listdir('./coffeescript/') if f.endswith(".min.js")])

f = open('./javascript/site.min.js', 'w')
for source in js_files:
    f.write(open(source).read())
    f.write('\n')
f.close()


# binding css
js_files = ['./css/' + f for f in os.listdir('./css/') if f.endswith(".min.css") and not f.endswith("site.min.css")]

f = open('./css/site.min.css', 'w')
for source in js_files:
    f.write(open(source).read())
    f.write('\n')
f.close()
