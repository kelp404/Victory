
router = angular.module 'victory', ['ui.state']
router.config ($stateProvider) ->
    $stateProvider.state 'index',
        url: ''
        templateUrl: "/views/login.html"
        controller: controller.index
    $stateProvider.state 'index-2',
        url: '/'
        templateUrl: "/views/login.html"
        controller: controller.index

    $stateProvider.state 'login',
        url: '/login'
        views:
            viewContent:
                templateUrl: '/views/login.html'
                controller: controller.login
