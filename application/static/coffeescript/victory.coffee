
window.victory =
    userLevel:
        root: 0
        normal: 1
    loginUrl: ''
    logoutUrl: ''
    user:
        userId: 0
        level: 1
        name: null
        email: null
        isLogin: false
        isRoot: ->
            victory.user.level == victory.userLevel.root
