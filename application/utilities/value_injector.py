
#
# Value Injector
# Kelp
# http://kelp.phate.org/
# MIT License
#

import logging


class ValueInjector():

    def inject(strong, source):
        source_properties = getattr(source, 'properties', None)
        if source_properties and callable(source_properties):
            # gae big table
            source_properties = source.properties()
            for name in dir(strong):
                try:
                    attr = getattr(strong.__class__, name)
                    if not callable(attr) and name.find('__') != 0 and source_properties.has_key(name):
                        setattr(strong, name, getattr(source, name, None))
                except:
                    pass
        elif type(source) == type({}):
            # weak-typing
            for name in dir(strong):
                try:
                    attr = getattr(strong.__class__, name)
                    if not callable(attr) and name.find('__') != 0 and source.has_key(name):
                        setattr(strong, name, source[name])
                except:
                    pass
        else:
            # class
            ValueInjector.inject(strong, source.__dict__)

    inject = staticmethod(inject)
