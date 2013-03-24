
core =
    ###
    core JavaScript object.
    ###
    text_loading: 'Loading...'
    is_ie: false
    is_safari: false

    pop_state: (state) ->
        ###
        pop state
        ###
        if state
            $('.modal.in').modal 'hide'
            state.is_pop = true
            @miko state, false
        return

    miko: (state, push) ->
        ###
        みこ
        :param state: history.state
        :param push: true -> push into history, false do not push into history
        ###
        before_index = $('#nav_bar li.active').index()
        state.method ?= 'get'
        push = false if state.method != 'get'
        $.ajax
            url: state.href, type: state.method, cache: false, data: state.data
            # fixed flash when pop state in safari
            async: !(core.is_safari and state.is_pop)
            beforeSend: (xhr) ->
                index = if state.href == '/' then 0 else $('#nav_bar li a[href*="' + state.href + '"]').parent().index()
                core.nav_select index
                xhr.setRequestHeader 'X-Miko', 'miko'
                core.loading_on core.text_loading
            error: ->
                core.loading_off()
                core.error_message()
                core.nav_select before_index
            success: (r) ->
                core.loading_off()

                # push state
                if push
                    if state.href != location.pathname or location.href.indexOf('?') >= 0
                        state.nav_select_index = $('#nav_bar li.active').index()
                        history.pushState(state, document.title, state.href)
                    $('html, body').animate scrollTop: 0, 500, 'easeOutExpo'

                miko = r.match(/<!miko>/)
                if !miko
                    location.reload()
                    return

                title = r.match(/<title>(.*)<\/title>/)
                r = r.replace(title[0], '')
                document.title = title[1]
                content = r.match(/\s@([#.]?\w+)/)
                if content
                    # update content
                    $(content[1]).html r.replace(content[0], '')
                core.after_page_loaded()
        false

    error_message: ->
        ###
        pop error message.
        ###
        $.av.pop {title: 'Error', message: 'Loading failed, please try again later.', template: 'error'}

    validation: ($form) ->
        ###
        validation
        ###
        success = true
        $form.find('input, textarea').each ->
            validation = $(@).attr 'validation'
            if validation and validation.length > 0
                if $(@).val().match(validation)
                    $(@).closest('.control-group').removeClass 'error'
                    $(@).parent().find('.error_msg').remove()
                else
                    $(@).closest('.control-group').addClass 'error'
                    $(@).parent().find('.error_msg').remove()
                    if $(@).attr 'msg'
                        $(@).parent().append $('<label for="' + $(@).attr('id') + '" class="error_msg help-inline">' + $(@).attr('msg') + '</label>')
                    success = false
        success

    loading_on: (message) ->
        ###
        loading
        ###
        $('body, a, .table-pointer tbody tr').css cursor: 'wait'
        if core.is_ie then return

        if $('#loading').length > 0
            $('#loading .message').html message
            return

        loading = $('<div id="loading"><div class="spin"></div><div class="message">' + message + '</div><div class="clear"></div></div>')
        $('body').append loading
        loading_height = $('#loading').height()
        $('#loading').css bottom: -loading_height
        $('#loading').animate bottom: '+=' + (loading_height + 10) , 400, 'easeOutExpo'
        Spinner({ color: '#444', width: 2, length: 4, radius: 4 }).spin $('#loading .spin')[0]
    loading_off: ->
        $('body').css cursor: 'default'
        $('a, .table-pointer tbody tr').css cursor: 'pointer'
        if core.is_ie then return

        $('#loading').dequeue()
        loading_height = $('#loading').height() + 10
        $('#loading').animate bottom: '-=' + loading_height , 400, 'easeInExpo', ->
            $(@).remove()

    nav_select: (index, animate) ->
        ###
        nav bar
        ###
        animate ?= true

        if index > 0 and not $($('#nav_bar li')[index]).hasClass 'select'
            $('#nav_bar li').removeClass 'select'
            $($('#nav_bar li')[index]).addClass 'select'

            if animate
                $($('#nav_bar li')[index]).mouseover()
            else
                $('#nav_bar li.top').each( -> $(@).dequeue()).animate(
                    width: $('#nav_bar li.select').css 'width'
                    left: $('#nav_bar li.select').position().left
                    , 0)
    setup_nav: ->
        match = location.href.match /\w(\/\w*)/
        if match
            index = if match[1] == '/' then 0 else $('#nav_bar li a[href*="' + match[1] + '"]').parent().index()
            $('#nav_bar li').removeClass 'select'
            $($('#nav_bar li')[index]).addClass 'select'

        $('#nav_bar li.select').parent().prepend $('<li class="top"></li>')
        $('#nav_bar li.top').css
            width: $('#nav_bar li.select').css('width')
            left: $('#nav_bar li.select').position().left
            top: $('#nav_bar li.select').position().top

        # mouse hover
        noop = -> return
        $('#nav_bar li[class!=top]').hover( ->
            $('#nav_bar li.top').each( -> $(@).dequeue()).animate(
                width: @offsetWidth
                left: @offsetLeft
                , 420, "easeInOutCubic")
        , noop())
        $('#nav_bar').hover noop(), ->
            $('#nav_bar li.top').each( -> $(@).dequeue()).animate(
                width: $('#nav_bar li.select').css 'width'
                left: $('#nav_bar li.select').position().left
                , 420, "easeInOutCubic")

    setup_link: ->
        ###
        setup hyper links and forms to ajax and push history.
        ###

        # link
        $(document).on 'click', 'a:not([href*="#"])', (e) ->
            # open in a new tab
            if e.metaKey then return

            # menu
            if $(@).closest('.active').length > 0 and $(@).closest('.menu').length > 0
                return false

            href = $(@).attr 'href'
            if href and not $(@).attr 'target'
                core.miko href: href, true
                return false
            return

        # form get
        $(document).on 'submit', 'form[method=get]:not([action*="#"])', ->
            href = $(@).attr('action') + '?' + $(@).serialize()
            core.miko href: href, true
            $('.modal.in').modal 'hide'
            false

        # form post
        $(document).on 'submit', 'form[method=post]:not([action*="#"])', ->
            if core.validation $(@)
                href = $(@).attr 'action'
                core.miko {href: href, data: $(@).serialize(), method: 'post'}
                $('.modal.in').modal 'hide'
            false

    setup_enter_submit: ->
        ###
        .enter-submit.keypress() Ctrl + Enter then submit the form
        ###
        $(document).on 'keypress', '.enter-submit', (e) ->
            if e.keyCode == 13 and e.ctrlKey
                $(@).closest('form').submit()
                false

    after_page_loaded: ->
        ###
        events of views
        ###
        core.setup_datetime()
        core.setup_focus()
        core.setup_tooltip()

    setup_datetime: ->
        ###
        datetime
        ###
        $('.datetime').each ->
            try
                date = new Date $(@).attr('datetime')
                $(@).html date.toFormat $(@).attr('format')

    setup_focus: ->
        ###
        focus
        ###
        $('.focus').select()

    setup_tooltip: ->
        ###
        tool tip
        ###
        $('[rel="tooltip"]').tooltip()

window.core = core

user_agent = navigator.userAgent.toLowerCase()
core.is_ie = user_agent.indexOf('msie') != -1;
core.is_safari = user_agent.indexOf('safari') != -1 and user_agent.indexOf('chrome') == -1
