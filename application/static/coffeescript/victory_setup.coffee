
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
