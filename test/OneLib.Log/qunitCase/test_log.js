

module( "group 3:记录日志", {
    setup: function() {
        // prepare something for all following tests
    },
    teardown: function() {
        // clean up after each test
        $(".__log__").remove();
        OneLib.Log.config({enable:undefined});
    }
});

test( "Logger.writeLine", function() {
    var _logger = new OneLib.Log.Logger(true);
    _logger.writeLine('this is a log message');
    _logger.writeLine('this is another log message');
    strictEqual( _logger.count, 2, "_logger.count is the logged info count" );
    strictEqual( $(".__log__").length, 2, "default will write to DOM" );
});

test( "Logger.enable and OneLib.Log.config", function() {
    var _logger = new OneLib.Log.Logger(false);
    _logger.writeLine('this is a log message');
    _logger.writeLine('this is another log message');
    strictEqual( _logger.count, 0, "_logger.enable is false,so logger do not work" );
    strictEqual( $(".__log__").length, 0, "_logger.enable is false,so logger do not work" );

    OneLib.Log.config({enable:true});
    _logger.writeLine('this is a log message');
    _logger.writeLine('this is another log message');
    strictEqual( _logger.count, 2, "global enable the log,so logger begin work" );
    strictEqual( $(".__log__").length, 2, "global enable the log,so logger begin work" );

    $(".__log__").remove();
    _logger = new OneLib.Log.Logger(true);
    OneLib.Log.config({enable:false});
    _logger.writeLine('this is a log message');
    _logger.writeLine('this is another log message');
    strictEqual( _logger.count, 0, "global disable the log,so logger do not work" );
    strictEqual( $(".__log__").length, 0, "global disable the log,so logger do not work" );

});

test( "Logger.setStyle", function() {
    var _logger = new OneLib.Log.Logger(true);
    _logger.writeLine('this is a log message');
    strictEqual( $(".__log__")[0].style.color, 'red', "default style is red" );

    $(".__log__").remove();
    _logger.setStyle('color:blue;font-size:28px;');
    _logger.writeLine('this is a new log message');
    strictEqual( $(".__log__")[0].style.color, 'blue', "setted style is blue" );
    strictEqual( $(".__log__")[0].style['fontSize'], '28px', "setted size is 28" );

});
test( "Logger.setMode", function() {
    var _logger = new OneLib.Log.Logger(true);
    _logger.setMode(0);
    _logger.writeLine('this is a log message');
    strictEqual( $(".__log__").length, 0, "mode 0 use console,so do not write DOM" );
    _logger.setMode(1);
    _logger.writeLine('this is another log message');
    strictEqual( $(".__log__").length, 1, "mode 1 use DOM" );

});