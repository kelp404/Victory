
setup = angular.module 'victory.setup', []
# setup
setup.directive 'relTooltip', ->
    ###
    setup tooltip
    ###
    (scope, element, attrs) ->
        $(element).tooltip()
