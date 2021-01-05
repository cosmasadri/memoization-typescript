type Func = (...args: any[]) => any;

type Resolver = (...args: any[]) => string;

export const memoize = <F extends Func, R extends Resolver>(
  func: F,
  timeout: number,
  resolver?: R,
): ((...args: Parameters<F>) => ReturnType<F>) => {
  const cache = {} as any;

  return (...args: Parameters<F>): ReturnType<F> => {
    const cacheKey =
      resolver == null ? JSON.stringify(args) : resolver(...args);

    const memoizedValue = cache[cacheKey];

    if (memoizedValue !== undefined) {
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
