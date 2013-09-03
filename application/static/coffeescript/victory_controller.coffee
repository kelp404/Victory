
# default page size
pageSize = 20

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
        Get applications.
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
        Add an application.
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
        Update the application.
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
        Delete the application.
        ###
        victory.ajax $http,
            method: 'delete'
            url: "/settings/applications/#{id}"
            success: ->
                $('.modal.in').modal 'hide'
                $scope.getApplications()
    $scope.inviteUser = (id, email) ->
        ###
        Invite an user into the application.
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
        Delete the member from the application.
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
        Get users.
        ###
        victory.ajax $http,
            url: '/settings/users'
            success: (data) ->
                $scope.items = data.items
    $scope.addUser = ->
        ###
        Add an user.
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
        Delete the user.
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
c.controller 'GroupedDocumentsCtrl', ($scope, $state, $stateParams, $http) ->
    ###
    /crashes/grouped
    /exceptions/grouped
    /logs/grouped

    :scope documentMode: <crashes/exceptions/logs>
    :scope selectedApplicationId: application id
    :scope searchKeyword: search keywords
    :scope page: current page
    :scope applications: [{id, name, description,
                        app_key, create_time, is_owner}]
    :scope documents: [{group_tag, create_time, name, email, title, description, times}]
    :scope page: {total, index, max}
    ###
    # setup documentMode
    if $state.current.name.indexOf('exception')
        $scope.documentMode = 'exceptions'
    else if $state.current.name.indexOf('log')
        $scope.documentMode = 'logs'
    else
        $scope.documentMode = 'crashes'

    # setup selectedApplication
    if sessionStorage.selectedApplication
        $scope.selectedApplication = JSON.parse sessionStorage.selectedApplication

    $scope.getApplications = ->
        ###
        Get applications
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
        Get grouped documents by application id.
        ###
        victory.ajax $http,
            url: "/applications/#{id}/#{$scope.documentMode}/grouped"
            success: (data) ->
                $scope.groupedDocuments = data.items
                $scope.page =
                    total: data.total
                    index: 0
                    max: (data.total - 1) / pageSize
                    hasPrevious: false
                    hasNext: pageSize < data.total

    $scope.searchGroupedDocuments = (keyword) ->
        ###
        Search grouped documents with keywords.
        ###
        victory.ajax $http,
            url: "/applications/#{$scope.selectedApplication.id}/#{$scope.documentMode}/grouped/?q=#{keyword}"
            success: (data) ->
                console.log 'success'
    $scope.gotoSearchPage = (keyword) ->
        location.href = "#/applications/#{$scope.selectedApplication.id}/#{$scope.documentMode}/grouped/q/#{keyword}"

    $scope.getGroupedDocumentHref = (groupedDocument) ->
        ###
        Get the href of the grouped document.
        :param groupedDocument: grouped document
        :return: "#/applications/{{application_id}}/{{documentMode}}/{{group_tag}}" / "#document_{{group_tag}}"
        ###
        if groupedDocument.times > 1
            # documents page
            return "#/applications/#{$scope.selectedApplication.id}/#{$scope.documentMode}/#{groupedDocument.group_tag}"
        else
            # modal
            return "#document_#{groupedDocument.group_tag}"

    $scope.modal = (groupedDocument) ->
        ###
        Check the grouped document should show the bootstrap modal window.
        :param groupedDocument: grouped document
        :return: "modal" / ""
        ###
        if groupedDocument.times > 1
            return ""
        else
            return "modal"

    if $stateParams.keyword
        $scope.keyword = $stateParams.keyword
        $scope.searchGroupedDocuments $stateParams.keyword
    else
        $scope.getApplications()
