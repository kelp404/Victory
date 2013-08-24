
c = angular.module 'victory.controller', []
c.controller 'NavigationCtrl', ($scope) ->
    ###
    Navigation Controller
    ###
    delay = (ms, func) -> setTimeout func, ms

    # ui.router state change event
    $scope.$on '$stateChangeStart', (event, toState, toParams, fromState, fromParams) ->
        $scope.select = toState.name
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
c.controller 'SettingsApplicationsCtrl', ($scope, $state) ->
    ###
    /settings/applications
    ###
    return
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
