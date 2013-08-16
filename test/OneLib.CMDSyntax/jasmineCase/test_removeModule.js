describe('removeModule function:', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
    });

    it('should can remove a exist module', function () {
        //do some assert  //do some assert
        var logModule = OneLib.CMDSyntax.require('_log');//use alias to require OneLib.Log module
        expect(logModule).toBeDefined();

        expect(OneLib.CMDSyntax.removeModule('_log')).toBe(true);//remove success
        expect(OneLib.CMDSyntax.require('_log')).toBeUndefined();//the module is not exist again

    });
});