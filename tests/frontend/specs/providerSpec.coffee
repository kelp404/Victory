describe 'victory.provider', ->
    fakeModule = null
    victoryProvider = null

    beforeEach module('victory')
    beforeEach ->
        # mock NProgress
        window.NProgress =
            configure: ->

        fakeModule = angular.module 'fakeModule', ['victory.provider']
        fakeModule.config ($victoryProvider) ->
            victoryProvider = $victoryProvider
    beforeEach module('fakeModule')



    describe '$victory.$get', ->
        it '$victory.common should equal to $victoryProvider.common', inject ($victory) ->
            expect($victory.common).toBe victoryProvider.common
        it '$victory.setting should equal to $victoryProvider.setting', inject ($victory) ->
            expect($victory.setting).toBe victoryProvider.setting
        it '$victory.application should equal to $victoryProvider.application', inject ($victory) ->
            expect($victory.application).toBe victoryProvider.application
        it '$victory.document should equal to $victoryProvider.document', inject ($victory) ->
            expect($victory.document).toBe victoryProvider.document
