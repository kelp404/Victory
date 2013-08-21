

class UserAngularModel(object):
    userId = 0L
    isLogin = False
    isRoot = False
    name = ''
    email = ''

    def __init__(self, is_login=False, user_id=0L, is_root=False, name='', email=''):
        """
        Init

        :param is_login: is signed in?
        :param user_id: session id (long)
        :param is_root: is root?
        :param name: user name
        :param email: user email
        """
        self.isLogin = is_login
        self.userId = user_id
        self.isRoot = is_root
        self.name = name
        self.email = email
