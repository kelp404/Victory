

controllers =
    settingProfile: ($scope, $state) ->
        $scope.something = $state


victoryAngular = angular.module 'victoryAngular', ['ui.state']
victoryAngular.config ($stateProvider) ->
    $stateProvider.state 'route1',
        url: '/route1'
        templateUrl: "/views/login.html"
        controller: controllers.settingProfile

    $stateProvider.state 'index',
        url: ''
        templateUrl: "/views/login.html"
        controller: controllers.settingProfile
