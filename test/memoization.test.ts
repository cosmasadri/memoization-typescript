import { memoize } from '../src/memoization';

describe('memoization', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should memoize function result', () => {
    let returnValue = 5;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const testFunction = (key) => returnValue;

    const memoized = memoize(testFunction, 1000, (key) => key);

    const testArg = 'c544d3ae-a72d-4755-8ce5-d25db415b776';

    expect(memoized(testArg)).toBe(5);

    returnValue = 10;

    expect(memoized(testArg)).toBe(5);
  });

  test('should memoize function result without resolver', () => {
    let returnValue = 5;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const testFunction = (key) => returnValue;

    const memoized = memoize(testFunction, 1000);

    const testArg = 'c544d3ae-a72d-4755-8ce5-d25db415b776';

    expect(memoized(testArg)).toBe(5);

    returnValue = 10;

    expect(memoized(testArg)).toBe(5);
  });

  test('should memoize function result with defferent argument', () => {
    let returnValue = 5;
    let callCount = 0;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const testFunction = (key) => {
      callCount += 1;
      return returnValue;
    };

    const memoized = memoize(testFunction, 1000, (key) => key);

    const testArg1 = 'c544d3ae-a72d-4755-8ce5-d25db415b776';

    expect(callCount).toBe(0);

    expect(memoized(testArg1)).toBe(5);
    expect(callCount).toBe(1);

    returnValue = 10;

    expect(memoized(testArg1)).toBe(5);
    expect(callCount).toBe(1);

    const testArg2 = 'c544d3ae-a72d-4755-8ce5';

    expect(memoized(testArg2)).toBe(10);
    expect(callCount).toBe(2);
  });

  test('should retrieve memoized result if timeout is not exceeded (function should not be called)', () => {
    const returnValue = 5;
    let callCount = 0;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const testFunction = (key) => {
      callCount += 1;
      return returnValue;
    };

    const memoized = memoize(testFunction, 1000, (key) => key);

    const testArg = 'c544d3ae-a72d-4755-8ce5-d25db415b776';

    expect(callCount).toBe(0);

    expect(memoized(testArg)).toBe(5);
    expect(callCount).toBe(1);

    jest.advanceTimersByTime(999);

    expect(memoized(testArg)).toBe(5);
    expect(callCount).toBe(1);
  });

  test('should remove memoized result if timeout is exceeded (function must be called again to get result)', () => {
    let returnValue = 5;
    let callCount = 0;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const testFunction = (key) => {
      callCount += 1;
      return returnValue;
    };

    const memoized = memoize(testFunction, 1000, (key) => key);

    const testArg = 'c544d3ae-a72d-4755-8ce5-d25db415b776';

    expect(callCount).toBe(0);

    expect(memoized(testArg)).toBe(5);
    expect(callCount).toBe(1);

    returnValue = 10;
    jest.advanceTimersByTime(1000);

    expect(memoized(testArg)).toBe(10);
    expect(callCount).toBe(2);
  });
});
