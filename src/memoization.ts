type Func = (...args: any[]) => any;

// since resolver will take arguments for func function -> parameter types are the same
// (!) but since args of Func take type of any[] then it doesn't matter
type Resolver = (...args: Parameters<Func>) => string;

/**
 * Creates a function that memoizes the result of func. If resolver is provided,
 * it determines the cache key for storing the result based on the arguments provided to the memorized function.
 * By default, the first argument provided to the memorized function is used as the map cache key. The memorized values
 * timeout after the timeout exceeds. The timeout is in defined in milliseconds.
 *
 * @example
 * function addToTime(year, month, day) {
 *  return Date.now() + Date(year, month, day);
 * }
 *
 * const memoized = memoization.memoize(addToTime, (year, month, day) => year + month + day, 5000)
 *
 * // call the provided function cache the result and return the value
 * const result = memoized(1, 11, 26); // result = 1534252012350
 *
 * // because there was no timeout this call should return the memorized value from the first call
 * const secondResult = memoized(1, 11, 26); // secondResult = 1534252012350
 *
 * // after 5000 ms the value is not valid anymore and the original function should be called again
 * const thirdResult = memoized(1, 11, 26); // thirdResult = 1534252159271
 *
 * @param {Func} func the function for which the return values should be cached
 * @param {Number} timeout timeout for cached values in milliseconds
 * @param {Resolver|undefined} resolver if provided gets called for each function call with the exact same set of parameters as the
 * original function, the resolver function should provide the memoization key.
 */
export const memoize = <F extends Func, R extends Resolver>(
  func: F,
  timeout: number,
  resolver?: R,
): ((...args: Parameters<F>) => ReturnType<F>) => {
  // cache object to store the cached results (key must be string and value type is the return type of func)
  const cache: { [key: string]: ReturnType<F> } = {};

  return (...args: Parameters<F>): ReturnType<F> => {
    // create cache key with resolver function if provided, otherwise stringify the args for the key
    const cacheKey =
      resolver == null ? JSON.stringify(args) : resolver(...args);

    // retrieving result from cache object
    const memoizedValue = cache[cacheKey];

    // will return the memoized value if it exists, otherwise generate new and save it in cache
    // undefined is set for the condition, since there is a possibility of null to be saved as value
    if (memoizedValue !== undefined) {
      return memoizedValue;
    }

    const result = func(...args);
    cache[cacheKey] = result;

    // set timeout to delete cache key
    setTimeout(() => {
      delete cache[cacheKey];
    }, timeout);

    return result;
  };
};
