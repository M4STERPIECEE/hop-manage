import { useCallback, useEffect, useRef } from "react";

/**
 * A stable debounced wrapper around `callback`. Every call resets the timer, so
 * only the last invocation within `delayMs` runs — always with the latest
 * `callback` closure. Any pending call is cancelled on unmount or when
 * `delayMs` changes.
 *
 * Unlike a naive `useEffect`-on-value debounce, this never fires on mount and
 * its identity is stable, so passing it to children won't retrigger effects.
 */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs = 300,
): (...args: Args) => void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const cancel = useCallback(() => {
    if (timeoutRef.current !== undefined) clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => cancel, [cancel]);

  return useCallback(
    (...args: Args) => {
      cancel();
      timeoutRef.current = setTimeout(
        () => callbackRef.current(...args),
        delayMs,
      );
    },
    [cancel, delayMs],
  );
}
