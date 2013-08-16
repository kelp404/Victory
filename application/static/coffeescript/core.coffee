
core =
    ###
    core JavaScript object.
    ###
    if_first_pop: true
    text_loading: 'Loading...'
    is_safari: false
    is_ie: false
    socket: null
    is_modal_pop: false

    setup: ->
        ###
        setup core
        ###
        @setup_nav()
        @setup_link()
        @setup_enter_submit()
        window.onpopstate = (e) => @pop_state(e.state)

    pop_state: (state) ->
        ###
        pop state
        ###
        if @if_first_pop
            # pop event after document loaded
            @if_first_pop = false
            return

        if @is_modal_pop
            @is_modal_pop = false
            return

        if state
            state.is_pop = true
            @ajax state, false
        else
            state =
                is_pop: true,
                href: location.pathname
            @ajax state, false
        return

    ajax: (state, push) ->
        ###
        Load the page with ajax.
        :param state: history.state
            {
                method,     # ajax http method
                href,       # ajax http url
                data,       # ajax
                is_pop,     # true: user click back or forward
                is_modal    # true: show detail by modal. do not invoke ajax when history.back()
            }
        :param push: true -> push into history, false do not push into history
        ###
        before_index = $('#js_navigation li.active').index()
        state.method ?= 'get'
        push = false if state.method != 'get'
        $.ajax
            url: state.href, type: state.method, cache: false, data: state.data
            # fixed flash when pop state in safari
            async: !(core.is_safari and state.is_pop)
            beforeSend: (xhr) ->
                index = if state.href == '/' then 1 else $("#js_navigation li a[href*='#{state.href}']").parent().index()
                core.nav_select index
                xhr.setRequestHeader 'X-ajax', 'ajax'
                core.loading_on core.text_loading
            error: (r) ->
                core.loading_off()
                core.error_message(r.status)
                core.nav_select before_index
            success: (r, status, xhr) ->
                if r.__redirect
                    # redirect
                    core.ajax href: r.__redirect, true
                    return

                core.loading_off()

                content_type = xhr.getResponseHeader("content-type")
                if content_type.indexOf('json') >= 0 and r.__status == 400
                    # input error
                    for key in Object.keys(r)
                        msg = r[key]
                        $control = $("##{key}").closest '.control-group'
                        $control.find('.help-inline').remove()
                        if msg
                            $control.addClass 'error'
                            $control.find('.controls').append $("<label for='#{key}' class='help-inline'>#{msg}</label>")
                        else
                            $control.removeClass 'error'
                    return

                # hide modal
                $('.modal.in').modal 'hide'

                # push state
                if push
                    if state.href != location.pathname or location.href.indexOf('?') >= 0
                        history.pushState state, document.title, state.href
                    $('html, body').animate scrollTop: 0, 500, 'easeOutExpo'
                else
                    # submit form at modal
                    if history.state and history.state.is_modal
                        core.is_modal_pop = true
                        history.back()

                is_ajax = r.match(/<!ajax>/)
                if !is_ajax
                    location.reload()
                    return

                r = r.replace(/<!ajax>/, '')
                $content = $("<div id='js_root'>#{r}</div>")
                document.title = $content.find('title').text()
                $content.find('.js_ajax').each ->
                    target = $(@).attr('data-ajax-target')
                    $("##{target}").html $(@).find("##{target}").html()
                    $("##{target}").attr 'class', $(@).find("##{target}").attr('class')
                    return

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

    nav_select: (index, animate=true) ->
        ###
        navigation
        ###
        if index > 0 and not $($('#js_navigation li')[index]).hasClass 'select'
            $('#js_navigation li').removeClass 'select'
            $($('#js_navigation li')[index]).addClass 'select'

            if animate
                $($('#js_navigation li')[index]).mouseover()
            else
                $('#js_navigation li.cs_top').each( -> $(@).dequeue()).animate(
                    width: $('#js_navigation li.select').css 'width'
                    left: $('#js_navigation li.select').position().left
                    , 0)
    setup_nav: ->
        match = location.href.match /\w(\/\w*)/
        if match
            index = if match[1] == '/' then 0 else $('#js_navigation li a[href*="' + match[1] + '"]').parent().index()
            $('#js_navigation li').removeClass 'select'
            $($('#js_navigation li')[index]).addClass 'select'

        $('#js_navigation li.select').parent().prepend $('<li class="cs_top"></li>')
        $('#js_navigation li.cs_top').css
            width: $('#js_navigation li.select').css('width')
            left: $('#js_navigation li.select').position().left
            top: $('#js_navigation li.select').position().top

        # mouse hover
        noop = -> return
        $('#js_navigation li[class!=cs_top]').hover( ->
            $('#js_navigation li.cs_top').each( -> $(@).dequeue()).animate(
                width: @offsetWidth
                left: @offsetLeft
                , 420, "easeInOutCubic")
        , noop())
        $('#js_navigation').hover noop(), ->
            $('#js_navigation li.cs_top').each( -> $(@).dequeue()).animate(
                width: $('#js_navigation li.select').css 'width'
                left: $('#js_navigation li.select').position().left
                , 420, "easeInOutCubic")

    setup_link: ->
        ###
        setup hyper links and forms to ajax and push history.
        ###
        # ie not supports high level code
        return if @is_ie

        # detail modal toggle
        $(document).on 'click', '.js_detail', (e) ->
            if e.metaKey then return

            m = $(@).attr('data-detail-url').match(/(.*)#(.*)/)
            if m
                href = m[1]
                target_id = m[2]
                history.pushState href: href, is_modal: true, document.title, href
                # register shown event
                $("##{target_id}").on 'shown', ->
                    $($(@).find('input')[0]).select()
                    $(@).off 'shown'

                # register hidden event
                $("##{target_id}").on 'hidden', ->
                    if history.state and history.state.is_modal
                        core.is_modal_pop = true
                        history.back()
                    $(@).off 'hidden'

                $("##{target_id}").modal()
                return false

        # link
        $(document).on 'click', 'a:not([href*="#"]):not([href^="javascript:"])', (e) ->
            # open in a new tab
            return if e.metaKey

            href = $(@).attr 'href'
            if href and not $(@).attr 'target'
                core.ajax href: href, true
                return false
            return

        # form get
        $(document).on 'submit', 'form[method=get]:not([action*="#"])', ->
            href = $(@).attr('action') + '?' + $(@).serialize()
            core.ajax href: href, true
            false

        # form post
        $(document).on 'submit', 'form[method=post]:not([action*="#"])', ->
            href = $(@).attr 'action'
            core.ajax {href: href, data: $(@).serialize(), method: 'post'}
            false

        # form put
        $(document).on 'submit', 'form[method=put]:not([action*="#"])', ->
            href = $(@).attr 'action'
            core.ajax {href: href, data: $(@).serialize(), method: 'put'}
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
