type Func = (...args: any[]) => any;

export const memoize = <F extends Func>(
  func: F,
  timeout: number,
  resolver?: F,
): ((...args: Parameters<F>) => ReturnType<F>) => {
  const cache = {} as any;

  return (...args: Parameters<F>): ReturnType<F> => {
    const cacheKey =
      resolver == null ? JSON.stringify(args) : resolver(...args);

    const memoizedValue = cache[cacheKey];

    if (memoizedValue != null) {
      return memoizedValue;
    } else {
      const result = func(...args);
      cache[cacheKey] = result;

      setTimeout(() => {
        delete cache[cacheKey];
      }, timeout);
      return result;
    }
  };
};
