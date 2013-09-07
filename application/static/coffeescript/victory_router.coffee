
r = angular.module 'victory.router', ['victory.controller', 'victory.service', 'victory.directive', 'ui.router', 'ui.state']
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
        resolve:
            title: -> 'Applications - Settings - '
            applications: ($victory) ->
                $victory.setting.getApplications()
        views:
            viewContent:
                templateUrl: '/views/settings/applications.html'
                controller: 'SettingsApplicationsCtrl'
            viewMenu:
                templateUrl: '/views/menu/settings.html'
                controller: 'SettingsMenuCtrl'
    $stateProvider.state 'settings-users',
        url: '/settings/users'
        resolve:
            title: -> 'Users - Settings - '
            users: ($victory) ->
                $victory.setting.getUsers()
        views:
            viewContent:
                templateUrl: '/views/settings/users.html'
                controller: 'SettingsUsersCtrl'
            viewMenu:
                templateUrl: '/views/menu/settings.html'
                controller: 'SettingsMenuCtrl'
    $stateProvider.state 'settings-profile',
        url: '/settings/profile'
        resolve:
            title: -> 'Profile - Settings - '
            profile: ($victory) ->
                $victory.setting.getProfile()
        views:
            viewContent:
                templateUrl: '/views/settings/profile.html'
                controller: 'SettingsProfileCtrl'
            viewMenu:
                templateUrl: '/views/menu/settings.html'
                controller: 'SettingsMenuCtrl'

    # ---------- documents ----------------
    $stateProvider.state 'grouped-crashes',
        url: '/crashes/grouped'
        resolve:
            title: -> 'Crashes - '
            documentMode: -> 'crashes'
        templateUrl: '/views/documents/grouped.html'
        controller: 'GroupedDocumentsCtrl'

    $stateProvider.state 'grouped-exceptions',
        url: '/exceptions/grouped'
        resolve:
            title: -> 'Exceptions - '
            documentMode: -> 'exceptions'
            groupedDocumentsAndApplications: ($victory) ->
                $victory.document.getGroupedDocumentsAndApplications 'exceptions'
        templateUrl: '/views/documents/grouped.html'
        controller: 'GroupedDocumentsCtrl'
    $stateProvider.state 'grouped-exceptions-search',
        url: '/applications/:applicationId/exceptions/grouped/:keyword/:index'
        resolve:
            title: -> 'Exceptions - '
            documentMode: -> 'exceptions'
            groupedDocumentsAndApplications: ($victory, $stateParams) ->
                $victory.document.getGroupedDocumentsAndApplications(
                    'exceptions',
                    $stateParams.applicationId,
                    $stateParams.keyword,
                    $stateParams.index)
        templateUrl: '/views/documents/grouped.html'
        controller: 'GroupedDocumentsCtrl'

    $stateProvider.state 'grouped-logs',
        url: '/logs/grouped'
        resolve:
            title: -> 'Logs - '
            documentMode: -> 'logs'
        templateUrl: '/views/documents/grouped.html'
        controller: 'GroupedDocumentsCtrl'
