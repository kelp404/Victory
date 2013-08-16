
class ViewEventsApplication
    ###
    event of views about applications.
    ###
    constructor: ->
        @show_modal_for_add_application()
        @update_application()
        @delete_application()
        @invite_user()
        @delete_viewer()

    show_modal_for_add_application: ->
        ###
        show adding application modal.
        ###
        $(document).on 'keypress', 'input.appended_input_application', (e) ->
            if e.keyCode == 13
                $(@).parent().find('a').click()
                return false
            return
        # call back
        $(document).on 'shown', '#form_add_application', ->
            $('#name').val $('.appended_input_application').val()
            $('#name').focus()

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
                error: (e) ->
                    core.loading_off()
                    if e.status in [400, 417]
                        $.av.pop {title: 'Error', message: 'Please check again.', template: 'error'}
                    else
                        core.error_message()
                success: ->
                    core.loading_off()
                    core.ajax href: location.href, false
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
                error: (e) ->
                    core.loading_off()
                    if e.status in [400, 417]
                        $.av.pop {title: 'Error', message: 'Please check again.', template: 'error'}
                    else
                        core.error_message()
                success: ->
                    core.loading_off()
                    core.ajax href: location.href, false
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
                error: (e) ->
                    core.loading_off()
                    if e.status in [400, 403, 417]
                        $invite_email.closest('.control-group').addClass 'error'
                    else
                        core.error_message()
                success: ->
                    core.loading_off()
                    $application_form.modal 'hide'
                    $.av.pop {title: 'Successful!', message: $invite_email.val() + ' will get a invited email.'}
                    core.ajax href: location.href, false
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
        @delete_user()

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
                        core.ajax href: location.href, false
                    else
                        $.av.pop {title: 'Error', message: 'Please check again.', template: 'error'}
            false



class ViewEventsAccount
    ###
    event of views about account.
    ###
    constructor: ->
        @update_profile()

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
                        $.av.pop {title: 'Successful!', message: 'Data had be Saved.', mode: 'alert'}
                        $('#name').val r.name
                        $($('#js_navigation .cs_profile p')[0]).text r.name
                    else
                        $.av.pop {title: 'Error', message: 'Please check again.', template: 'error'}
            false



class ViewEventsDocument
    ###
    event of views about documents.
    ###
    constructor: ->
        @click_document_group()

    click_document_group: ->
        ###
        click document group then go to documents view.
        :param url: $(this).attr('href')
        ###
        $(document).on 'click', 'tr.document_group', ->
            core.ajax href: $(this).attr('href'), true
            false



# event of views
class ViewEvents
    constructor: ->
        new ViewEventsApplication()
        new ViewEventsSwitchApplicationi()
        new ViewEventsUser()
        new ViewEventsAccount()
        new ViewEventsDocument()


$ ->
    # setup core
    core.setup()

    # setup events of views
    new ViewEvents()

    # that will be execute after miko call
    core.after_page_loaded()