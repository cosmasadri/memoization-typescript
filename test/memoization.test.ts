import { memoize } from '../src/memoization';

describe('memoization', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should memoize function result', () => {
    const mockFunction = jest.fn((key) => key);

    const timeout = 1000;

    // define first and second return value for mockFunction
    const firstReturnValue = 5;
    const secondReturnValue = 10;

    // inject first and second return value to mockFunction
    mockFunction
      .mockReturnValueOnce(firstReturnValue) // returned value of mockFunction at the first call
      .mockReturnValueOnce(secondReturnValue); // returned value of mockFunction at the second call

    // wrap mockFunction with memoize function
    const memoizedFunction = memoize(mockFunction, timeout, (key) => key);

    const testArg = 'c544d3ae-a72d-4755-8ce5-d25db415b776';

    // first call should return firstReturnValue
    expect(memoizedFunction(testArg)).toBe(5);

    // second call should return firstReturnValue, since timeout not yet exceeded and the result gained from the memoized results
    expect(memoizedFunction(testArg)).toBe(5);
  });

  test('should memoize function result without resolver', () => {
    const mockFunction = jest.fn((key) => key);

    const timeout = 1000;
    const firstReturnValue = 5;
    const secondReturnValue = 10;

    mockFunction
      .mockReturnValueOnce(firstReturnValue)
      .mockReturnValueOnce(secondReturnValue);

    // resolver is taken away from the memoize wrapper
    const memoizedFunction = memoize(mockFunction, timeout);

    const testArg = 'c544d3ae-a72d-4755-8ce5-d25db415b776';

    expect(memoizedFunction(testArg)).toBe(5);
    expect(memoizedFunction(testArg)).toBe(5);
  });

  test('should be able to memoize function result of null', () => {
    const mockFunction = jest.fn((key) => key);

    const timeout = 1000;

    // first result value is set to null
    const firstReturnValue = null;

    const secondReturnValue = 10;

    mockFunction
      .mockReturnValueOnce(firstReturnValue)
      .mockReturnValueOnce(secondReturnValue);

    const memoizedFunction = memoize(mockFunction, timeout, (key) => key);

    const testArg = 'c544d3ae-a72d-4755-8ce5-d25db415b776';

    expect(memoizedFunction(testArg)).toBeNull();

    // second call should return null (from memoize cache)
    expect(memoizedFunction(testArg)).toBeNull();
  });

  test('should memoize function result with defferent argument', () => {
    const mockFunction = jest.fn((key) => key);

    const timeout = 1000;
    const firstReturnValue = 5;
    const secondReturnValue = 10;

    mockFunction
      .mockReturnValueOnce(firstReturnValue)
      .mockReturnValueOnce(secondReturnValue);

    const memoizedFunction = memoize(mockFunction, timeout, (key) => key);

    const firstTestArg = 'c544d3ae-a72d-4755-8ce5-d25db415b776';
    const secondTestArg = 'c544d3ae-a72d-4755-8ce5';

    // mockFunction call should be 0, since no call has been made
    expect(mockFunction.mock.calls.length).toBe(0);

    // first call of the mockFunction -> call length should be one and it should return firstReturnValue
    expect(memoizedFunction(firstTestArg)).toBe(5);
    expect(mockFunction.mock.calls.length).toBe(1);

    // check whether mockFunction is called again or not when memoizedFunction is called again with firstTestArg
    // since argument used is the same as the first call and timeout is not exceeded, no further call on mockFunction
    expect(memoizedFunction(firstTestArg)).toBe(5);
    expect(mockFunction.mock.calls.length).toBe(1);

    // memoizeFunction call with secondTestArg should make mockFunction to be called again
    expect(memoizedFunction(secondTestArg)).toBe(10);
    expect(mockFunction.mock.calls.length).toBe(2);
  });

  test('should retrieve memoized result if timeout is not exceeded (function should not be called)', () => {
    const mockFunction = jest.fn((key) => key);

    const timeout = 1000;
    const returnValue = 5;

    mockFunction.mockReturnValueOnce(returnValue);

    const memoizedFunction = memoize(mockFunction, timeout, (key) => key);

    const testArg = 'c544d3ae-a72d-4755-8ce5-d25db415b776';

    expect(mockFunction.mock.calls.length).toBe(0);

    expect(memoizedFunction(testArg)).toBe(5);
    expect(mockFunction.mock.calls.length).toBe(1);

    // adding 999ms to the time
    jest.advanceTimersByTime(999);

    // call of mockFunction must still be 1, since timeout of 1000ms not yet exceeded
    expect(memoizedFunction(testArg)).toBe(5);
    expect(mockFunction.mock.calls.length).toBe(1);
  });

  test('should remove memoized result if timeout is exceeded (function must be called again to get result)', () => {
    const mockFunction = jest.fn((key) => key);

    const timeout = 1000;
    const firstReturnValue = 5;
    const secondReturnValue = 10;

    mockFunction
      .mockReturnValueOnce(firstReturnValue)
      .mockReturnValueOnce(secondReturnValue);

    const memoizedFunction = memoize(mockFunction, timeout, (key) => key);

    const testArg = 'c544d3ae-a72d-4755-8ce5-d25db415b776';

    expect(mockFunction.mock.calls.length).toBe(0);

    expect(memoizedFunction(testArg)).toBe(5);
    expect(mockFunction.mock.calls.length).toBe(1);

    // adding 1000ms to the time
    jest.advanceTimersByTime(1000);

    // call of mockFunction must still be 2, since timeout of 1000ms is exceeded
    // return value must be same as secondReturnValue
    expect(memoizedFunction(testArg)).toBe(10);
    expect(mockFunction.mock.calls.length).toBe(2);
  });
});
