//this module should load after b

var test_c=1;
if(!test_a||!test_b){
    throw 'module a,b not loaded!';
}

