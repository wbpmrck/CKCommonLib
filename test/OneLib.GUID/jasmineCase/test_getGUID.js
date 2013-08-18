describe('getGUID :', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
    });

    it('should get different GUIDs every time', function () {
        //do some assert
        define('testGUID', ['OneLib.GUID'], function (require, exports, module) {
            var GUID = require('OneLib.GUID');
            var num = 400;//test 1000 times
            var gened ={};
            while(num--){
                var guid = GUID.getGUID();
                expect(guid).toBeDefined();
                expect(gened[guid]).toBeUndefined();
                gened[guid] = true;
            }
        });

    });
    it('should can set the length and radix', function () {
        //do some assert
        define('testGUID.setLegnth', ['OneLib.GUID'], function (require, exports, module) {
            var GUID = require('OneLib.GUID');
            var num = 400;//test 1000 times
            while(num--){
                var guid = GUID.getGUID(11);
                expect(guid).toBeDefined();
                expect(guid.length).toBe(11);
            }
        });

        //todo:test radix not write yet
    });
});