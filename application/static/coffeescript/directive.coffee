a = angular.module 'victory.directive', []


# ----------------------------------------
# v-tooltip
# ----------------------------------------
a.directive 'vTooltip', ->
    ###
    Show the bootstrap tool tip.
    ###
    restrict: 'A'
    link: (scope, element, attrs) ->
        attrs.$observe 'vTooltip', (value) ->
            if value
                $(element).attr 'title', scope.$eval(value)
            $(element).tooltip()


# ----------------------------------------
# v-focus
# ----------------------------------------
a.directive 'vFocus', ->
    ###
    Focus this element.
    ###
    restrict: 'A'
    link: (scope, element) ->
        $(element).select()


# ----------------------------------------
# v-modal
# ----------------------------------------
a.directive 'vModal', ->
    ###
    Find the first input text box then focus it on the bootstrap modal window.
    ###
    restrict: 'A'
    link: (scope, element) ->
        $(element).on 'shown', ->
            $(@).find('input:first').select()


# ----------------------------------------
# v-enter
# ----------------------------------------
a.directive 'vEnter', ->
    ###
    Eval the AngularJS expression when pressed `Enter`.
    ###
    restrict: 'A'
    link: (scope, element, attrs) ->
        element.bind "keydown keypress", (e) ->
            if e.which is 13
                e.preventDefault()
                scope.$apply ->
                    scope.$eval attrs.vEnter


# ----------------------------------------
# v-navigation
# ----------------------------------------
vNavigation = ($injector) ->
    ###
    Setup the navigation effect.
    ###
    restrict: 'A'
    link: (scope, element) ->
        # ----------------------------------------
        # providers
        # ----------------------------------------
        $victory = $injector.get '$victory'


        # ----------------------------------------
        # scope
        # ----------------------------------------
        # ui.router state change event
        scope.$on '$stateChangeStart', (event, toState, toParams, fromState) ->
            # (event, toState, toParams, fromState, fromParams) ->
            if fromState.name != ""
                $victory.common.loading.on()
            scope.select = toState.name
            $('.modal.in').modal 'hide'
            setTimeout ->
                $('#js_navigation li.select').mouseover()
            , 0

        scope.$on '$stateChangeSuccess', ->
            # (event, toState, toParams, fromState, fromParams) ->
            $victory.common.loading.off()

        scope.$on '$stateChangeError', ->
            # (event, toState, toParams, fromState, fromParams, error) ->
            $victory.common.loading.off()


        # ----------------------------------------
        # navigation effect
        # ----------------------------------------
        if $(element).find('li.select').length > 0
            $selected = $(element).find('li.select')
        else
            match = location.href.match /\w\/([/#\w]*)/
            index = if match[1] is '' then 0 else $(element).find("li a[href*='#{match[1]}']").parent().index()
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
vNavigation.$inject = ['$injector']
a.directive 'vNavigation', vNavigation
