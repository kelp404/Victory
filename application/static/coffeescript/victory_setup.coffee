
s = angular.module 'victory.setup', []

s.directive 'vTooltip', ->
    ###
    setup tooltip
    ###
    (scope, element, attrs) ->
        $(element).tooltip()

s.directive 'vFocus', ->
    ###
    setup focus
    ###
    (scope, element, attrs) ->
        $(element).select()

s.directive 'vNavigation', ->
    ###
    setup navigation
    ###
    (scope, element, attrs) ->
        match = location.href.match /\w\/([/#\w]*)/
        if match
            index = if match[1] == '' then 0 else $(element).find('li a[href*="' + match[1] + '"]').parent().index()
            $(element).find('li').removeClass 'select'
            $(element).find('li').eq(index).addClass 'select'

        $(element).find('li.select').parent().prepend $('<li class="cs_top"></li>')
        $(element).find('li.cs_top').css
            width: $(element).find('li.select').css('width')
            left: $(element).find('li.select').position().left
            top: $(element).find('li.select').position().top

        # mouse hover
        noop = -> return
        $(element).find('li[class!=cs_top]').hover ->
            $(element).find('li.cs_top').each( -> $(@).dequeue()).animate(
                width: @offsetWidth
                left: @offsetLeft
                , 420, "easeInOutCubic")
        , noop()
        $(element).hover noop(), ->
            $(element).find('li.cs_top').each( -> $(@).dequeue()).animate(
                width: $(element).find('li.select').css 'width'
                left: $(element).find('li.select').position().left
                , 420, "easeInOutCubic")
        return
