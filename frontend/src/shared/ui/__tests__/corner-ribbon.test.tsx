// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CornerRibbon } from "../corner-ribbon";

afterEach(() => {
  cleanup();
});

describe("CornerRibbon", () => {
  it("renders its label", () => {
    render(<CornerRibbon label="Terminé" />);
    expect(screen.getByText("Terminé")).toBeDefined();
  });

  it("exposes the variant on a data attribute", () => {
    render(<CornerRibbon label="Terminé" variant="neutral" />);
    expect(
      screen.getByTestId("corner-ribbon").getAttribute("data-variant"),
    ).toBe("neutral");
  });

  it("defaults to the success variant", () => {
    render(<CornerRibbon label="Terminé" />);
    expect(
      screen.getByTestId("corner-ribbon").getAttribute("data-variant"),
    ).toBe("success");
  });
});
