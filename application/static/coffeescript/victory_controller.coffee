
c = angular.module 'victory.controller', []
c.controller 'index', ($scope, $state) ->
    ###
    /
    ###
    if not victory.user.isLogin
        location.href = '#/login'

c.controller 'login', ($scope, $state) ->
    ###
    /login
    ###
    $scope.loginUrl = victory.loginUrl
