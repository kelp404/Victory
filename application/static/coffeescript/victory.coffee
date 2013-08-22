
victory =
    userLevel:
        root: 0
        normal: 1
    loginUrl: ''
    isIE: false
    isSafari: false
    user:
        userId: 0
        level: 1
        name: null
        email: null
        isLogin: false
        isRoot: ->
            victory.user.level == victory.userLevel.root

    ajax: (args={}) ->
        args.type ?= 'get'
        args.cache ?= false
        args.data ?= ''
        $.ajax
            url: args.url, type: args.type, cache: args.ache, data: args.data
            beforeSend: (xhr) ->
#                index = if state.href == '/' then 1 else $("#js_navigation li a[href*='#{state.href}']").parent().index()
#                core.nav_select index
                victory.loading.on 'Loading...'
                args.beforeSend() if args.beforeSend
            success: (r, status, xhr) ->
                victory.loading.off()
                return

    loading:
        on: (message) ->
            ###
            loading
            ###
            $('body, a, .table-pointer tbody tr').css cursor: 'wait'
            return if victory.isIE

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
            return if victory.isIE

            $('#loading').dequeue()
            loading_height = $('#loading').height() + 10
            $('#loading').animate bottom: '-=' + loading_height , 400, 'easeInExpo', ->
                $(@).remove()

    setup:
        all: ->
            for key of @
                if key != 'all'
                    @[key]()
            return

    getUserProfile: ->
        ###
        update login status
        ###
        $.ajax
            url: '/me', type: 'get', dataType: 'json', cache: false, async: false
            error: (r) =>
                @user.isLogin = false
            success: (r) =>
                @user = r
        @user


window.victory = victory

user_agent = navigator.userAgent.toLowerCase()
victory.isIE = user_agent.indexOf('msie') != -1
victory.isSafari = user_agent.indexOf('safari') != -1 and user_agent.indexOf('chrome') == -1
