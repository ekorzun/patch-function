

// patchFunction
// Depends on underscore || lodash
//
// Args:
//  fn [function] – function needs to be patched
//  after [function] – function or object
//  condition [function] - 
//
// Example:
//  newFunction = patchFunction( oldFunction, {
//      condition : function( oldFnArg1, oldFnArg2 ){
//          if( oldFnArg1 < 0 ) return false;
//      },
//      before : function(){}    
//  })
function patch(fn, after, before, condition, replace) {

    // Temp variable for saving after() result
    var afterAsResult;
    
    // Prepare callbacks
    if (!isFunction(after) && isObject(after)) {
        before = after.before;
        condition = after.condition;
        replace = after.replace;
        afterAsResult = after.afterAsResult;
        after = after.after;
    }

    // Original function can be completely replaced with the new one
    var oldfn = replace || fn;

    
    return function() {
        
        // Make sure that context is ok
        var context = this,
            args = arguments,
            result,
            beforeresult;

        // If condition passed ... 
        if (isFunction(condition) && (condition.apply(context, args) === false)) {
            return false;
        }

        // Fire before
        if (isFunction(before)) {
            beforeresult = before.apply(context, args);
        }
        
        // Before callback can return a promise object
        if (beforeresult !== undefined && beforeresult.then) {

            
            var _args = Array.prototype.slice.call(args);
            
            //
            beforeresult.then(function(resolved) {
                // 
                args.push(resolved);
                result = oldfn.apply(context, _args);
                
                // Fire after
                if(isFunction(after)){
                    after.apply(context, _args);
                }
            });

        } else {
            
            //
            result = oldfn.apply(context, args);
            
            // 
            if(isFunction(after)){
                var _args = Array.prototype.slice.call(args);
                _args.push( result );
                var afterresult = after.apply(context, _args);
                
                // By the way, after can return own results
                if( afterAsResult ) {
                    return afterresult;
                }
            }

        }
        
        return result;
    }
}



function isFunction(A){
    return typeof A === 'function'
}

function isObject(A){
    return (typeof A === "object") && (A !== null)
}


if( typeof exports !== 'undefined') {
    module.exports = patch
}