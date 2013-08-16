describe('addAlias function:', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
        OneLib.CMDSyntax.removeAllModulesExcept('_log');
    });

    it('should can add alias to a module,then you can use alia name to require it', function () {
        //do some assert
        OneLib.CMDSyntax.addAlias({
            'logModule':'OneLib.Log'
        });
        define('testModule', ['logModule'], function (require, exports, module) {
            var logModule = require('logModule'); //built-in alias has allready give OneLib.Log Module two name,_log and _Log
            expect(logModule).toBeDefined();
        });
    });
    it('can not add reserved name to alias', function () {
        //do some assert
        expect(function(){
            OneLib.CMDSyntax.addAlias({
                'window':'global'
            });
        }).toThrow();
    });
});