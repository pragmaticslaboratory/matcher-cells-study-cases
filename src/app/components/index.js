function expressionInterpreter(expresion, contextObj) {
    let result;
    try {
        with (contextObj) {
            result = eval(expresion);
        }
    } catch (error) {
        if (error instanceof ReferenceError) {
            return false; //return false when it is not possible to evaluate
        } else {
            throw error; //other error
        }
    }
    return result;
}

expression = "foo(2) + bar(baz(2),2)"
contextObj = {foo: function(x) {...}, bar: function(x,y) { ...}, baz: function(x){..}}