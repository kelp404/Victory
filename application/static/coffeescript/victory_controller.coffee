
c = angular.module 'victory.controller', []
c.controller 'NavigationCtrl', ($scope) ->
    ###
    Navigation Controller

    :scope select: selected ui-router node name
    ###
    delay = (ms, func) -> setTimeout func, ms

    # ui.router state change event
    $scope.$on '$stateChangeStart', (event, toState, toParams, fromState, fromParams) ->
        $scope.select = toState.name
        $('.modal.in').modal 'hide'
        delay 0, ->
            $('#js_navigation li.select').mouseover()


# ----------- controllers for ui.router ----------------
c.controller 'IndexCtrl', ($scope) ->
    ###
    /
    ###
    $scope.title = victory.titleSuffix
    if not victory.user.isLogin
        location.href = '#/login'

c.controller 'LoginCtrl', ($scope) ->
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

c.controller 'SettingsCtrl', ->
    ###
    /settings
    ###
    location.href = '#/settings/applications'
c.controller 'SettingsApplicationsCtrl', ($scope, $http) ->
    ###
    /settings/applications

    :scope name: new application name
    :scope description: new application description
    :scope items: [{id, name, newName, description, newDescription
                        app_key, create_time, is_owner, members:[{id, name, email, is_owner}]
                        }]
    ###
    $scope.getApplications = ->
        ###
        get applications
        ###
        victory.ajax $http,
            url: '/settings/applications'
            success: (data) ->
                for item in data.items
                    # for updating the application
                    item.newName = item.name
                    item.newDescription = item.description
                $scope.items = data.items
    $scope.addApplication = ->
        ###
        add an application
        ###
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
                $scope.name = ''
                $scope.description = ''
                $('.modal.in').modal 'hide'
                $scope.getApplications()
    $scope.updateApplication = (id) ->
        ###
        update the application.
        ###
        updateItem = (x for x in $scope.items when x.id == id)[0]
        victory.ajax $http,
            method: 'put'
            url: "/settings/applications/#{id}"
            data:
                name: updateItem.newName
                description: updateItem.newDescription
            error: (data, status) ->
                if status == 400 and data
                    updateItem.errors = data
            success: ->
                $('.modal.in').modal 'hide'
                $scope.getApplications()
    $scope.deleteApplication = (id) ->
        ###
        delete the application
        ###
        victory.ajax $http,
            method: 'delete'
            url: "/settings/applications/#{id}"
            success: ->
                $('.modal.in').modal 'hide'
                $scope.getApplications()
    $scope.inviteUser = (id, email) ->
        ###
        invite an user into the application
        ###
        victory.ajax $http,
            method: 'post'
            url: "/settings/applications/#{id}/members"
            data:
                email: email
            success: ->
                $('.modal.in').modal 'hide'
                $scope.getApplications()
    $scope.deleteMenter = (applicationId, memberId) ->
        ###
        delete the member from the application
        ###
        victory.ajax $http,
            method: 'delete'
            url: "/settings/applications/#{applicationId}/members/#{memberId}"
            success: ->
                application = (x for x in $scope.items when x.id == applicationId)[0]
                application.members = (x for x in application.members when x.id != memberId)
    $scope.getApplications()

c.controller 'SettingsUsersCtrl', ($scope, $http) ->
    ###
    /settings/users
    ###
    $scope.getUsers = ->
        ###
        get users
        ###
        victory.ajax $http,
            url: '/settings/users'
            success: (data) ->
                $scope.items = data.items
    $scope.addUser = ->
        ###
        add an user
        ###
        victory.ajax $http,
            method: 'post'
            url: '/settings/users'
            data:
                email: $scope.email
            success: ->
                $scope.email = ''
                $scope.getUsers()
    $scope.deleteUser = (id) ->
        ###
        delete the user
        ###
        victory.ajax $http,
            method: 'delete'
            url: "/settings/users/#{id}"
            success: ->
                $scope.items = (x for x in $scope.items when x.id != id)
    $scope.getUsers()

c.controller 'SettingsProfileCtrl', ($scope, $http) ->
    ###
    /settings/profile
    ###
    $scope.getProfile = ->
        victory.ajax $http,
            url: '/settings/profile'
            success: (data) ->
                $scope.profile = data
    $scope.updateProfile = ->
        victory.ajax $http,
            method: 'put'
            url: '/settings/profile'
            data:
                name: $scope.profile.name
            error: (data, status) ->
                if status == 400 and data
                    $scope.errors = data
            success: ->
                $scope.getProfile()
    $scope.getProfile()

# ----------- documents ----------------
c.controller 'GroupedDocumentsCtrl', ($scope, $state, $http) ->
    ###
    /crashes/grouped
    /exceptions/grouped
    /logs/grouped

    :scope documentMode: <crashes/exceptions/logs>
    :scope selectedApplicationId: application id
    :scope applications: [{id, name, description,
                        app_key, create_time, is_owner}]
    :scope documents: [{group_tag, create_time, name, email, title, description, times}]
    ###
    switch $state.current.name
        when 'grouped-exceptions' then $scope.documentMode = 'exceptions'
        when 'grouped-logs' then $scope.documentMode = 'logs'
        else $scope.documentMode = 'crashes'

    if sessionStorage.selectedApplication
        $scope.selectedApplication = JSON.parse sessionStorage.selectedApplication
    $scope.getApplications = ->
        ###
        get applications
        ###
        victory.ajax $http,
            url: '/applications'
            hideLoadingAfterDone: false
            success: (data) ->
                $scope.applications = data.items
                if data.items.length > 0
                    if not $scope.selectedApplication or $scope.selectedApplication.id not in [x.id for x in data.items]
                        # select the first application
                        $scope.selectedApplication = data.items[0]
                        sessionStorage.selectedApplication = JSON.stringify $scope.selectedApplication
                    # load document groups by application id
                    $scope.getGroupedDocuments $scope.selectedApplication.id
                else
                    victory.loading.off()

    $scope.getGroupedDocuments = (id) ->
        ###
        get grouped documents by application id
        ###
        victory.ajax $http,
            url: "/applications/#{id}/exceptions/grouped"
            success: (data) ->
                $scope.documentGroups = data.items
                $scope.documentTotal = data.total

    $scope.getApplications()
