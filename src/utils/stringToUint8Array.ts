
/**
 * Creates a Uint8Array from a given string.
 */
export function stringToUint8Array(value: string) {
  const arr = new Uint8Array({ length: value.length });

  for (let index = 0; index < value.length; index++) {
    arr[index] = value.charCodeAt(index);
  }

  return arr;
}
