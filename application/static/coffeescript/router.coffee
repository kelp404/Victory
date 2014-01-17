
a = angular.module 'victory.router', ['victory.controller', 'victory.provider', 'victory.directive',
                                      'ui.router']
run = ($injector) ->
    $rootScope = $injector.get '$rootScope'
    $state = $injector.get '$state'
    $stateParams = $injector.get '$stateParams'

    $rootScope.$state = $state
    $rootScope.$stateParams = $stateParams

a.run ['$injector', run]


config = ($stateProvider, $urlRouterProvider) ->
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
            applications: ['$victory', ($victory) ->
                $victory.setting.getApplications()
            ]
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
            users: ['$victory', ($victory) ->
                $victory.setting.getUsers()
            ]
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
            profile: ['$victory', ($victory) ->
                $victory.setting.getProfile()
            ]
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
            groupedDocumentsAndApplications: ['$victory', ($victory) ->
                $victory.document.getGroupedDocumentsAndApplications
                    documentMode: 'crashes'
            ]
        templateUrl: '/views/documents/grouped.html'
        controller: 'GroupedDocumentsCtrl'
    $stateProvider.state 'grouped-crashes-search',
        url: '/applications/:applicationId/crashes/grouped/:keyword/:index'
        resolve:
            title: -> 'Crashes - '
            documentMode: -> 'crashes'
            groupedDocumentsAndApplications: ['$victory', '$stateParams', ($victory, $stateParams) ->
                $victory.document.getGroupedDocumentsAndApplications
                    documentMode: 'crashes'
                    applicationId: $stateParams.applicationId
                    keyword: $stateParams.keyword
                    index: $stateParams.index
            ]
        templateUrl: '/views/documents/grouped.html'
        controller: 'GroupedDocumentsCtrl'
    $stateProvider.state 'crash',
        url: '/applications/:applicationId/crashes/:groupTag'
        resolve:
            title: -> 'Crash - '
            documentMode: -> 'crashes'
            crash: ['$victory', '$stateParams', ($victory, $stateParams) ->
                $victory.document.getCrashDocument
                    applicationId: $stateParams.applicationId
                    groupTag: $stateParams.groupTag
            ]
        templateUrl: '/views/documents/crash.html'
        controller: 'CrashDocumentCtrl'


    $stateProvider.state 'grouped-exceptions',
        url: '/exceptions/grouped'
        resolve:
            title: -> 'Exceptions - '
            documentMode: -> 'exceptions'
            groupedDocumentsAndApplications: ['$victory', ($victory) ->
                $victory.document.getGroupedDocumentsAndApplications
                    documentMode: 'exceptions'
            ]
        templateUrl: '/views/documents/grouped.html'
        controller: 'GroupedDocumentsCtrl'
    $stateProvider.state 'grouped-exceptions-search',
        url: '/applications/:applicationId/exceptions/grouped/:keyword/:index'
        resolve:
            title: -> 'Exceptions - '
            documentMode: -> 'exceptions'
            groupedDocumentsAndApplications: ['$victory', '$stateParams', ($victory, $stateParams) ->
                $victory.document.getGroupedDocumentsAndApplications
                    documentMode: 'exceptions'
                    applicationId: $stateParams.applicationId
                    keyword: $stateParams.keyword
                    index: $stateParams.index
            ]
        templateUrl: '/views/documents/grouped.html'
        controller: 'GroupedDocumentsCtrl'
    $stateProvider.state 'exceptions',
        url: '/applications/:applicationId/exceptions/:groupTag'
        resolve:
            title: -> 'Exceptions - '
            documentMode: -> 'exceptions'
            documents: ['$victory', '$stateParams', ($victory, $stateParams) ->
                $victory.document.getDocuments
                    documentMode: 'exceptions'
                    applicationId: $stateParams.applicationId
                    groupTag: $stateParams.groupTag
            ]
        templateUrl: '/views/documents/list.html'
        controller: 'DocumentsCtrl'


    $stateProvider.state 'grouped-logs',
        url: '/logs/grouped'
        resolve:
            title: -> 'Logs - '
            documentMode: -> 'logs'
            groupedDocumentsAndApplications: ['$victory', ($victory) ->
                $victory.document.getGroupedDocumentsAndApplications
                    documentMode: 'logs'
            ]
        templateUrl: '/views/documents/grouped.html'
        controller: 'GroupedDocumentsCtrl'
    $stateProvider.state 'grouped-logs-search',
        url: '/applications/:applicationId/logs/grouped/:keyword/:index'
        resolve:
            title: -> 'Logs - '
            documentMode: -> 'logs'
            groupedDocumentsAndApplications: ['$victory', '$stateParams', ($victory, $stateParams) ->
                $victory.document.getGroupedDocumentsAndApplications
                    documentMode: 'logs'
                    applicationId: $stateParams.applicationId
                    keyword: $stateParams.keyword
                    index: $stateParams.index
            ]
        templateUrl: '/views/documents/grouped.html'
        controller: 'GroupedDocumentsCtrl'
    $stateProvider.state 'logs',
        url: '/applications/:applicationId/logs/:groupTag'
        resolve:
            title: -> 'Logs - '
            documentMode: -> 'logs'
            documents: ['$victory', '$stateParams', ($victory, $stateParams) ->
                $victory.document.getDocuments
                    documentMode: 'logs'
                    applicationId: $stateParams.applicationId
                    groupTag: $stateParams.groupTag
            ]
        templateUrl: '/views/documents/list.html'
        controller: 'DocumentsCtrl'

a.config ['$stateProvider', '$urlRouterProvider', config]
