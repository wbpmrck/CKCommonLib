describe("OneLib.Log ", function() {

    it("should have config items called:configs", function() {
        expect(OneLib.Log.configs).toBeDefined();
        expect(OneLib.Log.configs).toEqual( {
            enable: undefined
        });//默认的配置
    });
    it("should have api called:config", function() {
        expect(OneLib.Log.config).toBeDefined();
        expect(OneLib.Log.config).toEqual(jasmine.any(Function));
    });
    it("should have Class called:Logger", function() {
        expect(OneLib.Log.Logger).toBeDefined();
        expect(OneLib.Log.Logger).toEqual(jasmine.any(Function));
    });


});