
controller =
    index: ($scope, $state) ->
        ###
        /
        ###
        if not victory.user.isLogin
            location.href = '#/login'

    login: ($scope, $state) ->
        ###
        /login
        ###
        $scope.loginUrl = victory.loginUrl

window.controller = controller
