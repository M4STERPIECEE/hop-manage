// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDebouncedCallback } from "../use-debounced-callback";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("useDebouncedCallback", () => {
  it("invokes the callback once after the delay, with the latest args", () => {
    vi.useFakeTimers();
    const spy = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(spy, 300));

    act(() => {
      result.current("a");
      result.current("b");
    });
    expect(spy).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("b");
  });

  it("does not fire on mount", () => {
    vi.useFakeTimers();
    const spy = vi.fn();
    renderHook(() => useDebouncedCallback(spy, 300));

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(spy).not.toHaveBeenCalled();
  });

  it("cancels a pending call on unmount", () => {
    vi.useFakeTimers();
    const spy = vi.fn();
    const { result, unmount } = renderHook(() =>
      useDebouncedCallback(spy, 300),
    );

    act(() => {
      result.current("x");
    });
    unmount();
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(spy).not.toHaveBeenCalled();
  });
});
