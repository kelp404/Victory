
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

s.directive 'vModal', ->
    ###
    setup modal show
    ###
    (scope, element, attrs) ->
        $(element).on 'shown', ->
            $(@).find('input:first').select()

s.directive 'vNavigation', ->
    ###
    setup navigation
    ###
    (scope, element, attrs) ->
        if $(element).find('li.select').length > 0
            $selected = $(element).find('li.select')
        else
            match = location.href.match /\w\/([/#\w]*)/
            index = if match[1] == '' then 0 else $(element).find('li a[href*="' + match[1] + '"]').parent().index()
            $selected = $(element).find('li').eq(index)

        $(element).find('li:first').parent().prepend $('<li class="cs_top"></li>')
        $(element).find('li.cs_top').css
            width: $selected.css('width')
            left: $selected.position().left
            top: $selected.position().top

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
