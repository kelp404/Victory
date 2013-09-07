
s = angular.module 'victory.service', []
s.factory '$victory', ($http, $rootScope) ->
    # setup the selected application
    if sessionStorage.selectedApplication
        # application {id, name, description, app_key, create_time, is_owner}
        $rootScope.selectedApplication = JSON.parse sessionStorage.selectedApplication

    # is stupid browser?
    user_agent = navigator.userAgent.toLowerCase()
    stupidBrowser = user_agent.indexOf('msie') != -1

    # default page size
    pageSize = 20

    # ---------------- common function ----------------
    common =
        ajax: (args={}) ->
            ###
            victory ajax function
            :param args: {method, cache, data, error(), success(), beforSend(), hideLoadingAfterDown}
            ###
            args.method ?= 'get'
            args.cache ?= false
            args.data ?= ''
            args.error ?= ->
            args.success ?= ->
            args.hideLoadingAfterDone ?= true

            @loading.on 'Loading...'
            args.beforeSend() if args.beforeSend

            h = $http
                url: args.url, method: args.method, cache: args.ache, data: args.data
            h.error (data, status, headers, config) =>
                @loading.off() if args.hideLoadingAfterDone
                @message.error status
                args.error(data, status, headers, config)
            h.success (data, status, headers, config) =>
                @loading.off() if args.hideLoadingAfterDone
                if data.__status__ == 302 and data.location
                    # redirect
                    location.href = data.location
                    return
                args.success(data, status, headers, config)
        message:
            error: (status) ->
                ###
                pop error message.
                ###
                switch status
                    when 400
                        $.av.pop
                            title: 'Input Failed'
                            message: 'Please check input values.'
                            template: 'error'
                    when 403
                        $.av.pop
                            title: 'Permission denied'
                            message: 'Please check your permission.'
                            template: 'error'
                    else
                        $.av.pop
                            title: 'Error'
                            message: 'Loading failed, please try again later.'
                            template: 'error'
        loading:
            ###
            Show/Hide loading effect.
            ###
            on: (message) ->
                ###
                loading
                ###
                $('body, a, .table-pointer tbody tr').css cursor: 'wait'
                return if @stupidBrowser

                if $('#loading').length > 0
                    $('#loading .message').html message
                    return

                loading = $("<div id='loading'><div class='spin'></div><div class='message'>#{message}</div><div class='cs_clear'></div></div>")
                $('body').append loading
                loading_height = $('#loading').height()
                $('#loading').css bottom: -loading_height
                $('#loading').animate bottom: '+=' + (loading_height + 10) , 400, 'easeOutExpo'
                Spinner({ color: '#444', width: 2, length: 4, radius: 4 }).spin $('#loading .spin')[0]
            off: ->
                $('body').css cursor: 'default'
                $('a, .table-pointer tbody tr').css cursor: 'pointer'
                return if @stupidBrowser

                $('#loading').dequeue()
                loading_height = $('#loading').height() + 10
                $('#loading').animate bottom: '-=' + loading_height , 400, 'easeInExpo', ->
                    $(@).remove()


    # -------------- setting ----------------
    setting =
        # -------------- application ----------------
        getApplications: (args={}) ->
            ###
            Get applications of the settings.
            :param args: {success()}
            ###
            ajax = common.ajax
                url: '/settings/applications'
                success: args.success
            ajax.then (data) ->
                # for resolve
                data.data.items
        addApplication: (args={}) ->
            ###
            Add the application.
            :param args: {data:{name, description}, error(), success()}
            ###
            common.ajax
                method: 'post'
                url: '/settings/applications'
                data: args.data
                error: args.error
                success: args.success
        updateApplication: (args={}) ->
            ###
            Update the application.
            :param args: {id, data:{name, description}, error(), success()}
            ###
            common.ajax
                method: 'put'
                url: "/settings/applications/#{args.id}"
                data: args.data
                error: args.error
                success: args.success
        deleteApplication: (args={}) ->
            ###
            Delete the application by id.
            :param args: {id, success()}
            ###
            common.ajax
                method: 'delete'
                url: "/settings/applications/#{args.id}"
                success: args.success
        inviteUser: (args={}) ->
            ###
            Invite the user into the application.
            :param args: {applicationId, email, success()}
            ###
            common.ajax
                method: 'post'
                url: "/settings/applications/#{args.applicationId}/members"
                data:
                    email: args.email
                success: args.success
        deleteMember: (args={}) ->
            ###
            Delete the member from the application.
            :param args: {applicationId, memberId, success()}
            ###
            common.ajax
                method: 'delete'
                url: "/settings/applications/#{args.applicationId}/members/#{args.memberId}"
                success: args.success

        # -------------- user ----------------
        getUsers: (args={}) ->
            ###
            Get users of the settings.
            :param args: {success()}
            ###
            ajax = common.ajax
                url: '/settings/users'
                success: args.success
            ajax.then (data) ->
                # for resolve
                data.data.items
        addUser: (args={}) ->
            ###
            Add an user.
            :param args: {email, success()}
            ###
            common.ajax
                method: 'post'
                url: '/settings/users'
                data:
                    email: args.email
                success: args.success
        deleteUser: (args={}) ->
            ###
            Delete the user by id.
            :param args: {id, success()}
            ###
            common.ajax
                method: 'delete'
                url: "/settings/users/#{args.id}"
                success: args.success

        # -------------- profile ----------------
        getProfile: (args={}) ->
            ###
            Get the profile.
            :param args: {success()}
            ###
            ajax = common.ajax
                url: '/settings/profile'
                success: args.success
            ajax.then (data) ->
                # for resolve
                data.data
        updateProfile: (args={}) ->
            ###
            Update the profile.
            :param args: {name, error(), success()}
            ###
            common.ajax
                method: 'put'
                url: '/settings/profile'
                data:
                    name: args.name
                error: args.error
                success: args.success


    # -------------- document ----------------
    document =
        getGroupedDocumentsAndApplications: (documentMode, applicationId, keyword, index) ->
            ###
            Get grouped documents and applications for GroupedDocumentsCtrl.
            :return: {applications, groupedDocuments, page}
            ###
            # cleanup input value
            keyword ?= ''
            index ?= 0
            applicationId = parseInt(applicationId)

            # result object
            result =
                applications: null
                groupedDocuments: null
                page: index: 0

            ajaxApplications = common.ajax
                url: '/applications'
                hideLoadingAfterDone: false
            ajaxApplications.then (data) =>
                result.applications = data.data.items
                if result.applications.length > 0
                    if applicationId in (x.id for x in result.applications)
                        # select the application
                        $rootScope.selectedApplication = (x for x in result.applications when x.id == applicationId)[0]
                        sessionStorage.selectedApplication = JSON.stringify $rootScope.selectedApplication
                    else if not $rootScope.selectedApplication or $rootScope.selectedApplication.id not in (x.id for x in result.applications)
                        # select the first application
                        $rootScope.selectedApplication = result.applications[0]
                        sessionStorage.selectedApplication = JSON.stringify $rootScope.selectedApplication

                    # load grouped documents by application id
                    ajaxDocuments = @getGroupedDocuments
                        applicationId: $rootScope.selectedApplication.id
                        documentMode: documentMode
                        keyword: keyword
                        index: index
                    ajaxDocuments.then (data) ->
                        result.groupedDocuments = data.data.items
                        result.page =
                            total: data.data.total
                            index: index
                            max: (data.data.total - 1) / pageSize
                            hasPrevious: index > 0
                            hasNext: (index + 1) * pageSize < data.data.total
                        result
                else
                    common.loading.off()
                    result
        getGroupedDocuments: (args={}) ->
            ###
            Get grouped documents
            :param args: {applicationId, documentMode, keyword, index success()}
            ###
            args.keyword ?= ''
            args.index ?= 0
            common.ajax
                url: "/applications/#{$rootScope.selectedApplication.id}/#{args.documentMode}/grouped?q=#{args.keyword}&index=#{args.index}"
                success: args.success


    # -------------- $victory ----------------
    stupidBrowser: stupidBrowser
    pageSize: pageSize
    common: common
    setting: setting
    document: document
