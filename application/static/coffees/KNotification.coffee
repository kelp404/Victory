# setTimeout
delay = (ms, func) -> setTimeout func, ms
# delay 1000, -> something param


KNotification =
    ###
    KNotification tool.
    ###
    width: 250
    height: 75
    prefix: 'n_'
    increment_id: 0
    queue: []
    pop: (arg) ->
        ###
        pop notification box.
        ###
        arg.expire ?= 5000
        arg.title ?= ''
        arg.message ?= ''

        nid = @prefix + ++@increment_id
        box = $ '<div id="' + nid + '" class="knotification"><div class="ntitle">' + arg.title + '</div><div class="nmessage">' + arg.message + '</div></div>'
        top = @queue.length * @height
        @queue.push nid
        $('body').append box
        $('#' + nid).css
            right: -@width
            top: top

        #insert notification
        $('#' + nid).animate right: 0, 400, 'easeOutExpo', delay arg.expire, -> KNotification.hide(nid)
        nid

    hide: (nid) ->
        ###
        hide notification box.
        ###
        @queue = @queue.filter (x) -> x != nid
        remove_top = parseInt $('#' + nid).css 'top'
        $('#' + nid).animate right: -@width, 400, 'easeInExpo', ->
            for id in KNotification.queue
                $box = $('#' + id)
                top = parseInt $box.css 'top'
                if top > remove_top
                    new_top = if $box.attr 'top' then parseInt $box.attr 'top' - KNotification.height else top - KNotification.height
                    $box.attr 'top': new_top
                    $box.dequeue()
                    $box.animate top: new_top, 400, 'easeOutExpo'
            $(@).remove()
        return

window.KNotification = KNotification