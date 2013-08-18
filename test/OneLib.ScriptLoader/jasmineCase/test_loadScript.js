describe('loadScript :', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
    });

    //todo:do not know how to test script loader,the script does not loading in the karma env
    it('should can load an external script async', function () {
        var flag,value =0;
        runs(function() {
            OneLib.ScriptLoader.loadScript('http://knockoutjs.com/downloads/knockout-2.3.0.js',function(){
                flag = true;
            });
        });
        waitsFor(function() {
            return flag;
        }, "The scriptLoader must have callback!", 4000);

        runs(function() {
            expect(window['ko']).toBeDefined();
        });

    });
});