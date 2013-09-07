
s = angular.module 'victory.service', []
s.factory '$victory', ($http, $rootScope) ->
    user_agent = navigator.userAgent.toLowerCase()
    stupidBrowser = user_agent.indexOf('msie') != -1

    stupidBrowser: stupidBrowser
    # default page size
    pageSize: 20
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
        loading
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

            loading = $('<div id="loading"><div class="spin"></div><div class="message">' + message + '</div><div class="clear"></div></div>')
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
