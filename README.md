# patch-function

Example:

```javascript
  newFunction = patchFunction( oldFunction, {
      condition: function( oldFnArg1, oldFnArg2 ){
          if( oldFnArg1 < 0 ) return false;
      } 
  })
```
