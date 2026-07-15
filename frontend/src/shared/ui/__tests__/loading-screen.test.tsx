// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LoadingScreen } from "../loading-screen";

afterEach(() => {
  cleanup();
});

describe("LoadingScreen", () => {
  it("renders the SIRH logo", () => {
    render(<LoadingScreen />);
    expect(screen.getByAltText("SIRH")).toBeDefined();
  });

  it("exposes a status role for assistive tech", () => {
    render(<LoadingScreen />);
    expect(screen.getByRole("status")).toBeDefined();
  });

  it("renders the loading subtitle", () => {
    render(<LoadingScreen />);
    expect(screen.getByText(/chargement de votre espace/i)).toBeDefined();
  });
});
