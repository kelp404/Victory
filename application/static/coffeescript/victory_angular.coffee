

controllers =
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


victoryAngular = angular.module 'victoryAngular', ['ui.state']
victoryAngular.config ($stateProvider) ->
    $stateProvider.state 'index',
        url: ''
        templateUrl: "/views/login.html"
        controller: controllers.index
    $stateProvider.state 'index-2',
        url: '/'
        templateUrl: "/views/login.html"
        controller: controllers.index

    $stateProvider.state 'login',
        url: '/login'
        views:
            viewContent:
                templateUrl: '/views/login.html'
                controller: controllers.login
