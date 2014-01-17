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


    describe '$victory', ->
        it 'test', inject ($victory) ->
            expect(0).toBe 0