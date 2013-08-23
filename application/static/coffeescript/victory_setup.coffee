
setup = angular.module 'victorySetup', []
# setup
setup.directive 'relTooltip', ->
    ###
    setup tooltip
    ###
    (scope, element, attrs) ->
        $(element).tooltip()
