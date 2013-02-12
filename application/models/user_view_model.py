

class UserViewModel(object):
    user_id = 0L
    is_root = False
    is_deletable = False
    name = ''
    email = ''
    create_time = ''

    def __init__(self, user_id, is_root, is_deletable, name, email, create_time):
        """
        Init

        @param user_id session id (long)
        @param is_root is root?
        @param is_deletable is deletable?
        @param name user name
        @param email user email
        @param create_time create time (json format)
        """
        self.user_id = user_id
        self.is_root = is_root
        self.is_deletable = is_deletable
        self.name = name
        self.email = email
        self.create_time = create_time