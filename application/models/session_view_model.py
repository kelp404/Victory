

class SessionViewModel(object):
    session_id = 0L
    is_current = False
    ip = ''
    user_agent = ''
    create_time = ''

    def __init__(self, session_id, is_current, ip, user_agent, create_time):
        """
        Init

        @param session_id session id (long)
        @param is_current is current session?
        @param ip ip address
        @param user_agent user agent
        @param create_time create time (json format)
        """
        self.session_id = session_id
        self.is_current = is_current
        self.ip = ip
        self.user_agent = user_agent
        self.create_time = create_time