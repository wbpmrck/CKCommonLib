describe("OneLib.CMDSyntax ", function() {

    it("should has API:define", function() {
        expect(OneLib.CMDSyntax.define).toBeDefined();
        expect(OneLib.CMDSyntax.define).toEqual(jasmine.any(Function)); //define is a function
    });
    it("should has global function:define", function() {
        expect(define).toBeDefined();
        expect(define).toEqual(jasmine.any(Function)); //define is a function
    });

    it("should has API:require", function() {
        expect(OneLib.CMDSyntax.require).toBeDefined();
        expect(OneLib.CMDSyntax.require).toEqual(jasmine.any(Function)); //define is a function
    });

    it("should has API:addAlias", function() {
        expect(OneLib.CMDSyntax.addAlias).toBeDefined();
        expect(OneLib.CMDSyntax.addAlias).toEqual(jasmine.any(Function)); //define is a function
    });

    it("should has API:wrapToModule", function() {
        expect(OneLib.CMDSyntax.wrapToModule).toBeDefined();
        expect(OneLib.CMDSyntax.wrapToModule).toEqual(jasmine.any(Function)); //define is a function
    });

    it("should has API:removeModule", function() {
        expect(OneLib.CMDSyntax.removeModule).toBeDefined();
        expect(OneLib.CMDSyntax.removeModule).toEqual(jasmine.any(Function)); //define is a function
    });
    it("should has API:removeAllModulesExcept", function() {
        expect(OneLib.CMDSyntax.removeAllModulesExcept).toBeDefined();
        expect(OneLib.CMDSyntax.removeAllModulesExcept).toEqual(jasmine.any(Function)); //define is a function
    });
    it("should has API:logOn", function() {
        expect(OneLib.CMDSyntax.logOn).toBeDefined();
        expect(OneLib.CMDSyntax.logOn).toEqual(jasmine.any(Function)); //define is a function
    });
    it("should has API:logOff", function() {
        expect(OneLib.CMDSyntax.logOff).toBeDefined();
        expect(OneLib.CMDSyntax.logOff).toEqual(jasmine.any(Function)); //define is a function
    });
});

