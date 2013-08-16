

module( "group 2:public API 存在", {
    setup: function() {
        // prepare something for all following tests
    },
    teardown: function() {
        // clean up after each test
    }
});

test( "OneLib.Log.configs exist", function() {
    strictEqual( window.OneLib.Log.hasOwnProperty('configs'), true, "API 'OneLib.Log.configs' must exist " );
    strictEqual( window.OneLib.Log.configs.enable, undefined, "enable should default to undefined" );
});
test( "OneLib.Log.config exist", function() {
    strictEqual( window.OneLib.Log.hasOwnProperty('config'), true, "API 'OneLib.Log.config' must exist " );
    strictEqual( typeof(window.OneLib.Log.config), 'function', "API 'OneLib.Log.config' must be function " );
});
test( "OneLib.Log.Logger exist", function() {
    strictEqual( typeof(window.OneLib.Log.Logger), 'function', "Class 'OneLib.Log.Logger' must be function " );
});