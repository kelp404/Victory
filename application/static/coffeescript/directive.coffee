
a = angular.module 'victory.directive', []

a.directive 'vTooltip', ->
    ###
    Show the bootstrap tool tip.
    ###
    (scope, element, attrs) ->
        if attrs.vTooltip
            $(element).attr 'title', scope.$eval(attrs.vTooltip)
        $(element).tooltip()

a.directive 'vFocus', ->
    ###
    Focus this element.
    ###
    (scope, element, attrs) ->
        $(element).select()

a.directive 'vModal', ->
    ###
    Find the first input text box then focus it on the bootstrap modal window.
    ###
    (scope, element, attrs) ->
        $(element).on 'shown', ->
            $(@).find('input:first').select()

a.directive 'vEnter', ->
    ###
    Eval the AngularJS expression when pressed `Enter`.
    ###
    (scope, element, attrs) ->
        element.bind "keydown keypress", (event) ->
            if event.which == 13
                scope.$apply ->
                    scope.$eval attrs.vEnter
                event.preventDefault()

a.directive 'vNavigation', ->
    ###
    Setup the navigation effect.
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
