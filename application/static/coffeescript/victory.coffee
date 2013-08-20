

victory = angular.module('victory', ['ui.state'])
victory.config ($stateProvider) ->
    $stateProvider.state 'route1',
        url: '/route1'
        views:
            viewA:
                templateUrl: "index.viewA.html"
            viewB:
                templateUrl: "index.viewB.html"

    $stateProvider.state 'index',
        url: ''
        views:
            viewA:
                templateUrl: "index.viewA.html"
            viewB:
                templateUrl: "index.viewB.html"
