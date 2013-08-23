
r = angular.module 'victory', ['victory.controller', 'victory.setup', 'ui.state']
r.config ($stateProvider) ->
    $stateProvider.state 'index',
        url: ''
        templateUrl: '/views/empty.html'
        controller: 'index'
    $stateProvider.state 'index-2',
        url: '/'
        templateUrl: '/views/empty.html'
        controller: 'index'

    $stateProvider.state 'login',
        url: '/login'
        views:
            viewContent:
                templateUrl: '/views/login.html'
                controller: 'login'
