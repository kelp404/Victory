
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
c.controller 'IndexCtrl', ->
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
c.controller 'SettingsApplicationsCtrl', ($scope, $victory, applications) ->
    ###
    /settings/applications

    :scope name: new application name
    :scope description: new application description
    :scope items: [{id, name, newName, description, newDescription
                        app_key, create_time, is_owner, members:[{id, name, email, is_owner}]
                        }]
    ###
    # setup applications
    for item in applications
        item.newName = item.name
        item.newDescription = item.description
    $scope.items = applications

    $scope.getApplications = ->
        ###
        Get applications.
        ###
        $victory.setting.getApplications
            success: (data) ->
                for item in data.items
                    item.newName = item.name
                    item.newDescription = item.description
                $scope.items = data.items
    $scope.addApplication = ->
        ###
        Add an application.
        ###
        $victory.setting.addApplication
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
        $victory.setting.updateApplication
            id: id
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
        $victory.setting.deleteApplication
            id: id
            success: ->
                $('.modal.in').modal 'hide'
                $scope.getApplications()
    $scope.inviteUser = (id, email) ->
        ###
        Invite an user into the application.
        ###
        $victory.setting.inviteUser
            applicationId: id
            email: email
            success: ->
                $('.modal.in').modal 'hide'
                $scope.getApplications()
    $scope.deleteMenter = (applicationId, memberId) ->
        ###
        Delete the member from the application.
        ###
        $victory.setting.deleteMember
            applicationId: applicationId
            memberId: memberId
            success: ->
                application = (x for x in $scope.items when x.id == applicationId)[0]
                application.members = (x for x in application.members when x.id != memberId)

c.controller 'SettingsUsersCtrl', ($scope, $victory, users) ->
    ###
    /settings/users
    ###
    $scope.items = users

    $scope.getUsers = ->
        ###
        Get users.
        ###
        $victory.setting.getUsers
            success: (data) ->
                $scope.items = data.items
    $scope.addUser = ->
        ###
        Add an user.
        ###
        $victory.setting.addUser
            email: $scope.email
            success: ->
                $scope.email = ''
                $scope.getUsers()
    $scope.deleteUser = (id) ->
        ###
        Delete the user.
        ###
        $victory.setting.deleteUser
            id: id
            success: ->
                $scope.items = (x for x in $scope.items when x.id != id)

c.controller 'SettingsProfileCtrl', ($scope, $victory, profile) ->
    ###
    /settings/profile
    ###
    $scope.profile = profile

    $scope.getProfile = ->
        $victory.setting.getProfile
            success: (data) ->
                $scope.profile = data
    $scope.updateProfile = ->
        $victory.setting.updateProfile
            name: $scope.profile.name
            error: (data, status) ->
                if status == 400 and data
                    $scope.errors = data
            success: ->
                $scope.getProfile()

# ----------- documents ----------------
c.controller 'GroupedDocumentsCtrl', ($scope, $victory, $state, $stateParams, documentMode, groupedDocumentsAndApplications) ->
    ###
    :scope documentMode: <crashes/exceptions/logs>
    :scope keyword: search keywords
    :scope applications: [{id, name, description,
                        app_key, create_time, is_owner}]
    :scope groupedDocuments: [{group_tag, create_time, name, email, title, description, times}]
    :scope page: {total, index, max, hasPrevious, hasNext}
    ###
    $scope.documentMode = documentMode
    $scope.keyword = if $stateParams.keyword then $stateParams.keyword else ''
    $scope.applications = groupedDocumentsAndApplications.applications
    $scope.groupedDocuments = groupedDocumentsAndApplications.groupedDocuments
    $scope.page = groupedDocumentsAndApplications.page

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
