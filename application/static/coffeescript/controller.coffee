
a = angular.module 'victory.controller', ['victory.provider']

# ----------- controllers for ui.router ----------------
indexController =  ($scope) ->
    ###
    /
    ###
    if $scope.victory.user.isLogin
        location.href = '#/crashes/grouped'
    else
        location.href = '#/login'

indexController.$inject = ['$scope']
a.controller 'IndexCtrl', indexController


# ----------- settings ------------------
settingsMenuController = ($scope, $state) ->
    ###
    The controller of the settings menu
    ###
    $scope.active = $state.current.name

settingsMenuController.$inject = ['$scope', '$state']
a.controller 'SettingsMenuCtrl', settingsMenuController


a.controller 'SettingsCtrl', ->
    ###
    /settings
    ###
    location.href = '#/settings/applications'


settingsApplicationsController = ($scope, $victory, applications) ->
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

settingsApplicationsController.$inject = ['$scope', '$victory', 'applications']
a.controller 'SettingsApplicationsCtrl', settingsApplicationsController


settingsUsersController = ($scope, $victory, users) ->
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

settingsUsersController.$inject = ['$scope', '$victory', 'users']
a.controller 'SettingsUsersCtrl', settingsUsersController


settingsProfileController = ($scope, $injector, profile) ->
    ###
    /settings/profile
    ###
    # providers
    $victory = $injector.get '$victory'
    $rootScope = $injector.get '$rootScope'

    # scope
    $scope.profile = profile

    $scope.getProfile = ->
        $victory.setting.getProfile
            success: (data) ->
                $rootScope.victory.user.name = data.name
                $scope.profile = data
    $scope.updateProfile = ->
        $victory.setting.updateProfile
            name: $scope.profile.name
            error: (data, status) ->
                if status == 400 and data
                    $scope.errors = data
            success: ->
                $scope.getProfile()

settingsProfileController.$inject = ['$scope', '$injector', 'profile']
a.controller 'SettingsProfileCtrl', settingsProfileController



# ----------- documents ----------------
groupedDocumentsController = ($scope, $stateParams, documentMode, groupedDocumentsAndApplications) ->
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

    $scope.clickGroupedDocument = (groupedDocument) ->
        ###
        Clicked the grouped document row in the table.
        ###
        if groupedDocument.times > 1 or $scope.documentMode == 'crashes'
            location.href = "#/applications/#{$scope.selectedApplication.id}/#{$scope.documentMode}/#{groupedDocument.group_tag}"

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

groupedDocumentsController.$inject = ['$scope', '$stateParams', 'documentMode', 'groupedDocumentsAndApplications']
a.controller 'GroupedDocumentsCtrl', groupedDocumentsController


documentsController = ($scope, $victory, documentMode, documents) ->
    ###
    /applications/<applicationId>/<documentMode>/<groupTag>
    ###
    $scope.documentMode = documentMode
    $scope.documents = documents
    $victory.application.getApplications
        success: (data) ->
            $scope.applications = data.items

    $scope.renderDescription = (document) ->
        ###
        Render the description of the document.
        ###
        if document.description
            return document.description
        else if document.parameters
            return "Parameters: #{document.parameters}"
        else if document.url
            return "URL: #{document.url}"
        ""

documentsController.$inject = ['$scope', '$victory', 'documentMode', 'documents']
a.controller 'DocumentsCtrl', documentsController


crashDocumentController = ($scope, $victory, documentMode, crash) ->
    ###
    /applications/<applicationId>/<documentMode>/<groupTag>
    ###
    $scope.documentMode = documentMode
    $scope.crash = crash
    $victory.application.getApplications
        success: (data) ->
            $scope.applications = data.items

crashDocumentController.$inject = ['$scope', '$victory', 'documentMode', 'crash']
a.controller 'CrashDocumentCtrl', crashDocumentController

