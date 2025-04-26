/**
 * Converts an array or object of values into a map using a key function.
 * The key function is used to generate the keys for the map.
 * The optional operation function is used to transform the values before adding them to the map.
 */
export function toMap<T, R = T>(
  values: Record<string, T> | T[],
  key: (value: T) => string = (value) => "" + value,
  op?: (value: T) => R
): Record<string, R> {
  const flattendValues = Object.values(values ?? []);
  return flattendValues.reduce(
    (acc, val) => ({
      ...acc,
      [key(val)]: op ? op(val) : val,
    }),
    {}
  );
}
