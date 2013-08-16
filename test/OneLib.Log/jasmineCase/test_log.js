describe("Logger.writeLine ", function() {
    var _logger,_disabledLogger;
    beforeEach(function() {
        _logger = new OneLib.Log.Logger(true);
        _disabledLogger = new OneLib.Log.Logger(false);
        spyOn(_logger,'writeLine').andCallThrough();
        spyOn(_disabledLogger,'writeLine').andCallThrough();
    });

    afterEach(function() {
        _logger = new OneLib.Log.Logger(true);
        _disabledLogger = new OneLib.Log.Logger(false);
        $(".__log__").remove();
        OneLib.Log.config({enable:undefined});
    });

    it("should write sth to DOM by default", function() {
        _logger.writeLine('this is a log message');
        expect(_logger.writeLine).toHaveBeenCalled();
        expect(_logger.writeLine.calls.length).toEqual(1);
        expect(_logger.count).toBe(1);
        expect( $(".__log__").length).toBe(1);

        _logger.writeLine('this is a log message');
        expect(_logger.writeLine.calls.length).toEqual(2);
        expect(_logger.count).toBe(2);
        expect( $(".__log__").length).toBe(2);
        expect(_logger.writeLine.calls.length).toEqual(2);
    });
    it("should write nothing when logger is disabled", function() {
        _disabledLogger.writeLine('this is a log message');
        expect(_disabledLogger.writeLine).toHaveBeenCalled();
        expect(_disabledLogger.writeLine.calls.length).toEqual(1);
        expect(_disabledLogger.count).toBe(0);
        expect( $(".__log__").length).toBe(0);
    });
    it("should write sth to DOM when logger is disabled,but global is enables", function() {
        _disabledLogger.writeLine('this is a log message');
        expect(_disabledLogger.count).toBe(0);
        expect( $(".__log__").length).toBe(0);

        OneLib.Log.config({enable:true});
        _disabledLogger.writeLine('this is a log message');
        expect(_disabledLogger.count).toBe(1);
        expect( $(".__log__").length).toBe(1);
    });
    it("should write nothing when logger is enabled,but global is disabled", function() {
        OneLib.Log.config({enable:false});
        _logger.writeLine('this is a log message');
        expect(_logger.count).toBe(0);
        expect( $(".__log__").length).toBe(0);
    });
});

describe('Logger.setStyle',function(){
    afterEach(function() {
        $(".__log__").remove();
        OneLib.Log.config({enable:undefined});
    });
    it('should can change the log style',function(){
        var _logger = new OneLib.Log.Logger(true);
        _logger.writeLine('this is a log message');
        expect( $(".__log__")[0].style.color).toBe('red');

        $(".__log__").remove();
        _logger.setStyle('color:blue;font-size:28px;');
        _logger.writeLine('this is a new log message');
        expect( $(".__log__")[0].style.color).toBe('blue');
        expect( $(".__log__")[0].style.fontSize).toBe('28px');
    });
});
describe('Logger.setMode',function(){
    afterEach(function() {
        $(".__log__").remove();
        OneLib.Log.config({enable:undefined});
    });
    it('should can change the log mode',function(){
        var _logger = new OneLib.Log.Logger(true);
        _logger.setMode(0);
        _logger.writeLine('this is a log message');
        expect( $(".__log__").length).toBe(0);
        _logger.setMode(1);
        _logger.writeLine('this is another log message');
        expect( $(".__log__").length).toBe(1);
    });
});
