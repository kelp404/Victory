
c = angular.module 'victory.controller', []
c.controller 'NavigationCtrl', ($scope) ->
    ###
    Navigation Controller
    ###
    delay = (ms, func) -> setTimeout func, ms

    # ui.router state change event
    $scope.$on '$stateChangeStart', (event, toState, toParams, fromState, fromParams) ->
        $scope.select = toState.name
        $('.modal.in').modal 'hide'
        delay 200, ->
            $('#js_navigation li.select').mouseover()


# ----------- controllers for ui.router ----------------
c.controller 'IndexCtrl', ($scope, $state) ->
    ###
    /
    ###
    $scope.title = victory.titleSuffix
    if not victory.user.isLogin
        location.href = '#/login'

c.controller 'LoginCtrl', ($scope, $state) ->
    ###
    /login
    ###
    $scope.loginUrl = victory.loginUrl

# ----------- settings ------------------
c.controller 'SettingsMenuCtrl', ($scope, $state) ->
    ###
    The controller of the settings menu
    ###
    $scope.active = $state.current.name

c.controller 'SettingsCtrl', ($scope, $state) ->
    ###
    /settings
    ###
    location.href = '#/settings/applications'
c.controller 'SettingsApplicationsCtrl', ($scope, $http) ->
    ###
    /settings/applications
    ###

    $scope.getApplications = ->
        victory.ajax $http,
            url: '/settings/applications'
            error: ->
                console.log 'error'
            success: (data) ->
                $scope.items = data.items
    $scope.addApplication = ->
        victory.ajax $http,
            method: 'post'
            url: '/settings/applications'
            data:
                name: $scope.name
                description: $scope.description
            error: (data, status) ->
                if status == 400 and data
                    $scope.errors = data
            success: ->
                $('.modal.in').modal 'hide'
                $scope.getApplications()
    $scope.updateApplication = (applicationId) ->
        victory.ajax $http,
            method: 'put'
            url: "/settings/applications/#{applicationId}"
            error: (data, status) ->
                console.log 'error'
            success: ->
                console.log 'success'
    $scope.deleteApplication = (applicationId) ->
        victory.ajax $http,
            method: 'delete'
            url: "/settings/applications/#{applicationId}"
            error: (data, status) ->
                console.log 'error'
            success: ->
                $('.modal.in').modal 'hide'
                $scope.getApplications()
    $scope.getApplications()

c.controller 'SettingsUsersCtrl', ($scope, $state) ->
    ###
    /settings/users
    ###
    return
c.controller 'SettingsProfileCtrl', ($scope, $state) ->
    ###
    /settings/profile
    ###
    return

# ----------- documents ----------------
c.controller 'CrashGroupsCtrl', ($scope, $state) ->
    ###
    /crash_groups
    ###
    return

c.controller 'ExceptionGroupsCtrl', ($scope, $state) ->
    ###
    /exception_groups
    ###
    return

c.controller 'LogGroupsCtrl', ($scope, $state) ->
    ###
    /log_groups
    ###
    return
