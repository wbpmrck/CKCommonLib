describe('OneLib.CMDSyntax.require function:', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
    });

    it('should can get a real module object ', function () {
        //do some assert
        var logModule = OneLib.CMDSyntax.require('_log');//use alias to require OneLib.Log module
        expect(logModule).toBeDefined();
    });
});