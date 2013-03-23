
class ViewEventsApplication
    ###
    event of views about applications.
    ###
    constructor: ->
        @show_modal_for_add_application()
        @add_application()
        @update_application()
        @delete_application()
        @invite_user()
        @delete_viewer()
        @

    show_modal_for_add_application: ->
        ###
        show adding application modal.
        ###
        $(document).on 'keypress', 'input.appended_input_application', (e) ->
            if e.keyCode == 13
                $(@).parent().find('a').click()
                return false
            return
        $(document).on 'click', 'a[href="#form_add_application"]', ->
            $('#name').val $('.appended_input_application').val()
            setTimeout "$('#name').focus()", 500
            return

    add_application: ->
        ###
        add an application.
        :param url: $(@).attr('action')
        :param data: $(@).serialize()
        ###
        $(document).on 'submit', 'form#form_add_application', ->
            return false if !core.validation $(@)

            $.ajax
                type: 'post', url: $(@).attr('action'), dataType: 'json', cache: false
                data: $(@).serialize()
                beforeSend: -> core.loading_on core.text_loading
                error: ->
                    core.loading_off()
                    core.error_message()
                success: (r) ->
                    core.loading_off()
                    if r.success
                        core.miko href: location.href, false
                    else
                        KNotification.pop
                            title: 'Failed!'
                            message: 'Please check again.'
            $($(@).closest('.modal')).modal 'hide'
            false

    update_application: ->
        ###
        update the application.
        :param url: $(this).attr('action')
        :param data: $(this).serialize()
        ###
        $(document).on 'submit', 'form.form_application', ->
            return false if !core.validation $(@).find('.modal-body')

            $.ajax
                type: 'put', url: $(@).attr('action'), dataType: 'json', cache: false
                data: $(@).serialize()
                beforeSend: -> core.loading_on core.text_loading
                error: ->
                    core.loading_off()
                    core.error_message()
                success: (r) ->
                    core.loading_off()
                    if r.success
                        core.miko href: location.href, false
                    else
                        KNotification.pop
                            title: 'Failed!'
                            message: 'Please check again.'
            $($(@).closest('.modal')).modal 'hide'
            false

    delete_application: ->
        ###
        delete the application.
        :param url: $(this).attr('href')
        :param application_id: $(this).attr('application_id')
        :param application_name: $(this).attr('application_name')
        ###
        $(document).on 'click', 'a.delete_application', ->
            $.ajax
                type: 'delete', url: $(@).attr('href'), dataType: 'json', cache: false
                data: { id: $(@).attr('document_id') }
                beforeSend: -> core.loading_on core.text_loading
                error: ->
                    core.loading_off()
                    core.error_message()
                success: (r) ->
                    core.loading_off()
                    if r.success
                        core.miko href: location.href, false
                    else
                        KNotification.pop
                            title: 'Failed!'
                            message: 'Please check again.'
            $($(@).closest('.modal')).modal 'hide'
            false

    invite_user: ->
        ###
        invite a user with the application.
        :param url: $(this).attr('href')
        :param email: $(this).closest('.input-append').find('input[type=text]')
        ###
        $(document).on 'click', 'a.invite', ->
            return false if !core.validation $(@).closest('.input-append')

            $application_form = $(@).closest 'form'
            $invite_email = $(@).closest('.input-append').find 'input[type=text]'

            $.ajax
                type: 'post', url: $(@).attr('href'), dataType: 'json', cache: false
                data: { email: $invite_email.val() }
                beforeSend: -> core.loading_on core.text_loading
                error: ->
                    core.loading_off()
                    core.error_message()
                success: (r) ->
                    core.loading_off()
                    if r.success
                        $application_form.modal 'hide'
                        KNotification.pop
                            title: 'Success!'
                            message: $invite_email.val() + ' will get a invited email.'
                        core.miko href: location.href, false
                    else
                        $invite_email.closest('.control-group').addClass 'error'
            false
        # click entern in text box
        $(document).on 'keypress', 'input.invite', (e) ->
            if e.keyCode == 13
                $('a.invite').click()
                return false
            return

    delete_viewer: ->
        ###
        delete a viewer in an application.
        :param url: $(this).attr('href')
        ###
        $(document).on 'click', 'a.delete_viewer', ->
            $member_div = $(@).closest 'div'
            $.ajax
                type: 'delete', url: $(@).attr('href'), dataType: 'json', cache: false
                beforeSend: -> core.loading_on core.text_loading
                error: ->
                    core.loading_off()
                    core.error_message()
                success: (r) ->
                    core.loading_off()
                    $member_div.remove() if r.success
            false



class ViewEventsSwitchApplicationi
    ###
    switch application then update nav link href.
    ###
    constructor: ->
        @change_nav()
        @

    change_nav: ->
        $(document).on 'click', '.change_nav', ->
            app_id = $(@).attr 'application_id'
            $('#nav_bar a[href^="/crash_groups"]').attr('href', '/crash_groups/' + app_id)
            $('#nav_bar a[href^="/exception_groups"]').attr('href', '/exception_groups/' + app_id)
            $('#nav_bar a[href^="/log_groups"]').attr('href', '/log_groups/' + app_id)
            return



class ViewEventsUser
    ###
    event of views about users.
    ###
    constructor: ->
        @add_user()
        @delete_user()
        @

    add_user: ->
        ###
        add a new user to Takanashi.
        :param url: $(this).attr('action')
        :param data: $(this).serialize()
        ###
        $(document).on 'submit', 'form#form_add_user', ->
            return false if !core.validation $(@)

            $.ajax
                type: 'post', url: $(@).attr('action'), dataType: 'json', cache: false
                data: $(@).serialize()
                beforeSend: -> core.loading_on core.text_loading
                error: ->
                    core.loading_off()
                    core.error_message()
                success: (r) ->
                    core.loading_off()
                    if r.success
                        core.miko href: location.href, false
                    else
                        KNotification.pop
                            title: 'Failed!'
                            message: 'Please check again.'
            false

    delete_user: ->
        ###
        delete the user.
        :param url: $(this).attr('href')
        ###
        $(document).on 'click', 'a.delete_user', ->
            return false if !core.validation $(@)

            $.ajax
                type: 'delete', url: $(@).attr('href'), dataType: 'json', cache: false
                beforeSend: -> core.loading_on core.text_loading
                error: ->
                    core.loading_off()
                    core.error_message()
                success: (r) ->
                    if r.success
                        core.miko href: location.href, false
                    else
                        KNotification.pop
                            title: 'Failed!'
                            message: 'Please check again.'
            false



class ViewEventsAccount
    ###
    event of views about account.
    ###
    constructor: ->
        @update_profile()
        @

    update_profile: ->
        ###
        update profile.
        :param url: $(this).attr('action')
        :param data: $(this).serialize()
        ###
        $(document).on 'submit', 'form#form_profile', ->
            return false if !core.validation $(@)

            $.ajax
                type: 'put', url: $(@).attr('action'), dataType: 'json', cache: false
                data: $(@).serialize()
                beforeSend: -> core.loading_on core.text_loading
                error: ->
                    core.loading_off()
                    core.error_message()
                success: (r) ->
                    core.loading_off()
                    if r.success
                        KNotification.pop
                            title: 'Success!'
                            message: 'Data had be Saved.'
                        $('#name').val r.name
                        $($('.profile p')[0]).text r.name
                    else
                        KNotification.pop
                            title: 'Failed!'
                            message: 'Please check again.'
            false



class ViewEventsDocument
    ###
    event of views about documents.
    ###
    constructor: ->
        @click_document_group()
        @

    click_document_group: ->
        ###
        click document group then go to documents view.
        :param url: $(this).attr('href')
        ###
        $(document).on 'click', 'tr.document_group', ->
            core.miko href: $(this).attr('href'), true
            false



# event of views
class ViewEvents
    constructor: ->
        new ViewEventsApplication()
        new ViewEventsSwitchApplicationi()
        new ViewEventsUser()
        new ViewEventsAccount()
        new ViewEventsDocument()
        @


$ ->
    core.setup_nav()
    core.setup_link()
    core.setup_enter_submit()
    window.onpopstate = (e) -> core.pop_state(e.state)

    # set up events of views
    new ViewEvents()

    # that will be execute after miko call
    core.after_page_loaded()