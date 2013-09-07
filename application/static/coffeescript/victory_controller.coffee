
c = angular.module 'victory.controller', ['victory.service']
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
c.controller 'SettingsApplicationsCtrl', ($scope, $victory) ->
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
        $victory.ajax
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
        $victory.ajax
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
        $victory.ajax
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
        $victory.ajax
            method: 'delete'
            url: "/settings/applications/#{id}"
            success: ->
                $('.modal.in').modal 'hide'
                $scope.getApplications()
    $scope.inviteUser = (id, email) ->
        ###
        Invite an user into the application.
        ###
        $victory.ajax
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
        $victory.ajax
            method: 'delete'
            url: "/settings/applications/#{applicationId}/members/#{memberId}"
            success: ->
                application = (x for x in $scope.items when x.id == applicationId)[0]
                application.members = (x for x in application.members when x.id != memberId)
    $scope.getApplications()

c.controller 'SettingsUsersCtrl', ($scope, $victory) ->
    ###
    /settings/users
    ###
    $scope.getUsers = ->
        ###
        Get users.
        ###
        $victory.ajax
            url: '/settings/users'
            success: (data) ->
                $scope.items = data.items
    $scope.addUser = ->
        ###
        Add an user.
        ###
        $victory.ajax
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
        $victory.ajax
            method: 'delete'
            url: "/settings/users/#{id}"
            success: ->
                $scope.items = (x for x in $scope.items when x.id != id)
    $scope.getUsers()

c.controller 'SettingsProfileCtrl', ($scope, $victory) ->
    ###
    /settings/profile
    ###
    $scope.getProfile = ->
        $victory.ajax
            url: '/settings/profile'
            success: (data) ->
                $scope.profile = data
    $scope.updateProfile = ->
        $victory.ajax
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
c.controller 'GroupedDocumentsCtrl', ($scope, $victory, $state, $stateParams) ->
    ###
    :scope documentMode: <crashes/exceptions/logs>
    :scope selectedApplication: the current application
    :scope keyword: search keywords
    :scope index: page index
    :scope applications: [{id, name, description,
                        app_key, create_time, is_owner}]
    :scope groupedDocuments: [{group_tag, create_time, name, email, title, description, times}]
    :scope page: {total, index, max, hasPrevious, hasNext}
    ###
    # setup documentMode
    if $state.current.name.indexOf('exception') >= 0
        $scope.documentMode = 'exceptions'
    else if $state.current.name.indexOf('log') >= 0
        $scope.documentMode = 'logs'
    else
        $scope.documentMode = 'crashes'

    # set default page.index
    $scope.page =
        index: 0

    # setup selectedApplication
    if sessionStorage.selectedApplication
        $scope.selectedApplication = JSON.parse sessionStorage.selectedApplication

    $scope.getApplications = ->
        ###
        Get applications, then get grouped documents.
        ###
        $victory.ajax
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
                    $scope.searchGroupedDocuments '', $stateParams.index
                else
                    victory.loading.off()

    $scope.searchGroupedDocuments = (keyword='', index=0) ->
        ###
        Search grouped documents with keywords.
        ###
        $victory.ajax
            url: "/applications/#{$scope.selectedApplication.id}/#{$scope.documentMode}/grouped?q=#{keyword}&index=#{index}"
            success: (data) ->
                $scope.groupedDocuments = data.items
                $scope.page =
                    total: data.total
                    index: index
                    max: (data.total - 1) / $victory.pageSize
                    hasPrevious: index > 0
                    hasNext: (index + 1) * $victory.pageSize < data.total

    $scope.getGroupedDocumentsUrl = (keyword, index=0) ->
        ###
        Get the url of grouped documents.
        ###
        return "#/applications/#{$scope.selectedApplication.id}/#{$scope.documentMode}/grouped/#{keyword}/#{index}"

    $scope.gotoSearchPage = (keyword, index=0) ->
        ###
        Goto the search page of grouped documents.
        ###
        location.href = $scope.getGroupedDocumentsUrl keyword, index

    $scope.getGroupedDocumentUrl = (groupedDocument) ->
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
        $scope.searchGroupedDocuments $stateParams.keyword, $stateParams.index
    else
        $scope.keyword = ''
        $scope.getApplications()
