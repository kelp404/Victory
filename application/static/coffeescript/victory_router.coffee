
r = angular.module 'victory', ['victory.controller', 'victory.setup', 'ui.router', 'ui.state']
r.run ($rootScope, $state, $stateParams) ->
    $rootScope.$state = $state
    $rootScope.$stateParams = $stateParams

r.config ($stateProvider, $urlRouterProvider) ->
    $urlRouterProvider.otherwise '/'

    $stateProvider.state 'index',
        url: '/'
        templateUrl: '/views/empty.html'
        controller: 'IndexCtrl'

    $stateProvider.state 'login',
        url: '/login'
        resolve: title: -> 'Sign In - '
        views:
            viewContent:
                templateUrl: '/views/login.html'
                controller: 'LoginCtrl'

    # ----------- settings ----------------
    $stateProvider.state 'settings',
        url: '/settings'
        templateUrl: '/views/empty.html'
        controller: 'SettingsCtrl'
    $stateProvider.state 'settings-applications',
        url: '/settings/applications'
        resolve: title: -> 'Applications - Settings - '
        views:
            viewContent:
                templateUrl: '/views/settings/applications.html'
                controller: 'SettingsApplicationsCtrl'
            viewMenu:
                templateUrl: '/views/menu/settings.html'
                controller: 'SettingsMenuCtrl'
    $stateProvider.state 'settings-users',
        url: '/settings/users'
        resolve: title: -> 'Users - Settings - '
        views:
            viewContent:
                templateUrl: '/views/settings/users.html'
                controller: 'SettingsUsersCtrl'
            viewMenu:
                templateUrl: '/views/menu/settings.html'
                controller: 'SettingsMenuCtrl'
    $stateProvider.state 'settings-profile',
        url: '/settings/profile'
        resolve: title: -> 'Profile - Settings - '
        views:
            viewContent:
                templateUrl: '/views/settings/profile.html'
                controller: 'SettingsProfileCtrl'
            viewMenu:
                templateUrl: '/views/menu/settings.html'
                controller: 'SettingsMenuCtrl'

    # ---------- documents ----------------
    $stateProvider.state 'crash-groups',
        url: '/crash_groups'
        templateUrl: '/views/document_groups.html'
        controller: 'CrashGroupsCtrl'

    $stateProvider.state 'exception-groups',
        url: '/exception_groups'
        templateUrl: '/views/document_groups.html'
        controller: 'ExceptionGroupsCtrl'

    $stateProvider.state 'log-groups',
        url: '/log_groups'
        templateUrl: '/views/document_groups.html'
        controller: 'LogGroupsCtrl'
