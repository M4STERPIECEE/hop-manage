// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StageBar } from "../stage-bar";

afterEach(() => {
  cleanup();
});

const stages = ["À confirmer", "Confirmé", "Terminé"];

const stateOf = (label: string) =>
  screen.getByText(label).getAttribute("data-state");

describe("StageBar", () => {
  it("renders every stage", () => {
    render(<StageBar stages={stages} current="Confirmé" />);
    for (const stage of stages) expect(screen.getByText(stage)).toBeDefined();
  });

  it("marks stages before the current one as done", () => {
    render(<StageBar stages={stages} current="Confirmé" />);
    expect(stateOf("À confirmer")).toBe("done");
  });

  it("marks the current stage", () => {
    render(<StageBar stages={stages} current="Confirmé" />);
    expect(stateOf("Confirmé")).toBe("current");
  });

  it("marks stages after the current one as upcoming", () => {
    render(<StageBar stages={stages} current="Confirmé" />);
    expect(stateOf("Terminé")).toBe("upcoming");
  });

  it("marks every stage upcoming when the current stage is unknown", () => {
    render(<StageBar stages={stages} current="Annulé" />);
    for (const stage of stages) expect(stateOf(stage)).toBe("upcoming");
  });
});
