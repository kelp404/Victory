
class DictMapping:
    """
    Dictionary Mapping
    copy all values in the dict object to the custom class instance.
    """
    @staticmethod
    def inject(strong, dic):
        """
        copy all value in dic to strong

        @param strong a custom class instance
        @param dic a dict object
        """
        if isinstance(dic, dict):
            # dict object
            for name in dir(strong):
                try:
                    if name[:2] != '__' and name in dic:
                        setattr(strong, name, dic[name])
                except: pass
        else:
            # class
            DictMapping.inject(strong, dic.__dict__)
