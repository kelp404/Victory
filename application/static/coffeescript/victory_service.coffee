
s = angular.module 'victory.service', []
s.service '$victory', ($http, $rootScope) ->
    # ----- setup root scope -------
    # setup the selected application
    if sessionStorage.selectedApplication
        # application {id, name, description, app_key, create_time, is_owner}
        $rootScope.selectedApplication = JSON.parse sessionStorage.selectedApplication

    # setup user info
    $rootScope.user = victory.user
    # ---------------------

    # ----- setup NProgress ------
    NProgress.configure
        showSpinner: false
    # ------------------------

    # ----- const -----------
    # default page size
    pageSize = 20
    # ---------------------

    # ---------------- $victory ----------------
    # is stupid browser?
    user_agent = navigator.userAgent.toLowerCase()
    stupidBrowser = user_agent.indexOf('msie') != -1

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

            args.beforeSend() if args.beforeSend

            h = $http
                url: args.url, method: args.method, cache: args.ache, data: args.data
            h.error (data, status, headers, config) =>
                @message.error status
                args.error(data, status, headers, config)
            h.success (data, status, headers, config) =>
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
            on: ->
                NProgress.start()
            off: ->
                NProgress.done()



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


    # -------------- application ----------------
    application =
        getApplications: (args={}) ->
            ###
            Get applications.
            :param args: {success()}
            ###
            common.ajax
                url: "/applications"
                success: args.success


    # -------------- document ----------------
    document =
        getGroupedDocumentsAndApplications: (args={}) ->
            ###
            Get grouped documents and applications for GroupedDocumentsCtrl.
            :param args: {documentMode, applicationId, keyword, index}
            :return: {applications, groupedDocuments, page}
            ###
            # cleanup input value
            args.applicationId = parseInt(args.applicationId)
            args.keyword ?= ''
            args.index ?= 0

            # result object
            result =
                applications: null
                groupedDocuments: null
                page: index: 0

            ajaxApplications = common.ajax
                url: '/applications'
            ajaxApplications.then (data) =>
                result.applications = data.data.items
                if result.applications.length > 0
                    if args.applicationId in (x.id for x in result.applications)
                        # select the application
                        $rootScope.selectedApplication = (x for x in result.applications when x.id == args.applicationId)[0]
                        sessionStorage.selectedApplication = JSON.stringify $rootScope.selectedApplication
                    else if not $rootScope.selectedApplication or $rootScope.selectedApplication.id not in (x.id for x in result.applications)
                        # select the first application
                        $rootScope.selectedApplication = result.applications[0]
                        sessionStorage.selectedApplication = JSON.stringify $rootScope.selectedApplication

                    # load grouped documents by application id
                    ajaxDocuments = @getGroupedDocuments
                        applicationId: $rootScope.selectedApplication.id
                        documentMode: args.documentMode
                        keyword: args.keyword
                        index: args.index
                    ajaxDocuments.then (data) ->
                        result.groupedDocuments = data.data.items
                        result.page =
                            total: data.data.total
                            index: args.index
                            max: (data.data.total - 1) / pageSize
                            hasPrevious: args.index > 0
                            hasNext: (args.index*1 + 1) * pageSize < data.data.total
                        result
                else
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
        getDocuments: (args={}) ->
            ###
            Get documents by the grouped tag.
            :param args: {applicationId, documentMode, groupTag, success()}
            ###
            ajax = common.ajax
                url: "/applications/#{args.applicationId}/#{args.documentMode}/#{args.groupTag}"
                success: args.success
            ajax.then (data) ->
                data.data.items
        getCrashDocument: (args={}) ->
            ###
            Get the crash document by the grouped tag.
            :param args: {applicationId, groupTag, success()}
            ###
            ajax = common.ajax
                url: "/applications/#{args.applicationId}/crashes/#{args.groupTag}"
                success: args.success
            ajax.then (data) ->
                crash = data.data.crash
                try
                    # append instruction_addr_hex
                    for thread in crash.report.crash.threads when thread.backtrace
                        for x in thread.backtrace.contents
                            x.instruction_addr_hex = '0x' + ('00000000' + x.instruction_addr.toString(16)).slice(-8)
                try
                    # append crashed threads
                    crash.crashedThreads = (x for x in crash.report.crash.threads when x.crashed)
                try
                    # append threads without crashed
                    crash.threads = (x for x in crash.report.crash.threads when not x.crashed)
                crash


    # -------------- $victory ----------------
    stupidBrowser: stupidBrowser
    common: common
    setting: setting
    application: application
    document: document
