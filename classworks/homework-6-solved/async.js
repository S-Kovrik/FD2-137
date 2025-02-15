function _async(generatorFn) {
  return (...args) => 
    new Promise((resolve, reject) => {
      const iterator = generatorFn(...args);
      const tick = (nextValue) => {
        const { done, value } = iterator.next(nextValue);

        if (value instanceof Promise || !done) {
          value.then(tick)
        }
        else {
          resolve(value);
        }

          // value.then((yieldResult) => {
          //   if (done) {
          //     resolve(yieldResult);
          //   } else {
          //     tick(yieldResult);
          //   }
          // }, reject);
        
        //  else {
        //   tick(value);
        // }
      };

      tick();
    });
  
}

const someAsyncAction = (el) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(el * 2), 1 * 1000);
  });
};

const oneMoreAsyncAction = (el) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(el * 2), 2 * 1000);
  });
};

const testFunction = _async(function* (a, b, c) {
  return (
    ((yield someAsyncAction(a)) + (yield oneMoreAsyncAction(b))) / (yield oneMoreAsyncAction(c))
  );
});

testFunction(2, 2, 1).then((a) => console.log(a));
