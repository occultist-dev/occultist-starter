
/**
 * Runs a function once after a cool down period has completed
 */
export function debounce(
  ms: number,
  fn: () => void | Promise<void>,
) {
  let timeout: number | undefined;

  return () => {
    clearTimeout(timeout);

    setTimeout(fn, ms);
  };
}
