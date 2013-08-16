describe('wrapToModule method:', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
    });

    it('should can wrap a exist Obj into a module', function () {
        //begin wrap
        OneLib.CMDSyntax.wrapToModule('$',jQuery);
        //do some assert
        var _jQuery = OneLib.CMDSyntax.require('$');
        expect(_jQuery).toBeDefined();
        expect(_jQuery.id).toBe('$');
        expect(_jQuery.name).toBe('$');
        expect(_jQuery.dependencies).toEqual([]);
        expect(_jQuery.dependenciesDic).toEqual({});
        expect(_jQuery.exports).toEqual(jQuery);

    });

    it('should throw error when try to dump wrap a exist moduleName or a reserved moduleName', function () {
        //do some assert
        expect(function(){
            OneLib.CMDSyntax.wrapToModule('$',jQuery);//dump wrap
        }).toThrow();
        expect(function(){
            OneLib.CMDSyntax.wrapToModule('window',jQuery);//reserved name
        }).toThrow();
    });

});
