module( "group 1:namespace 存在", {
    setup: function() {
        // prepare something for all following tests
    },
    teardown: function() {
        // clean up after each test
    }
});

test( "OneLib exist", function() {
    strictEqual( window.hasOwnProperty('OneLib'), true, "namespace 'OneLib' must exist " );
});
test( "OneLib.Log exist", function() {
    strictEqual( window.OneLib.hasOwnProperty('Log'), true, "namespace 'OneLib.Log' must exist " );
});

