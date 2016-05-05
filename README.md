# patch-function

// Args:
//  fn [function] – function needs to be patched
//  after [function] – function or object
//  condition [function] - 
//

Example:

```
  newFunction = patchFunction( oldFunction, {
      condition : function( oldFnArg1, oldFnArg2 ){
          if( oldFnArg1 < 0 ) return false;
      },
      before : function(){}    
  })
```
