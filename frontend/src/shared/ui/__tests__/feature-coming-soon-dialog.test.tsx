// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FeatureComingSoonDialog } from "../feature-coming-soon-dialog";

afterEach(() => {
  cleanup();
});

describe("FeatureComingSoonDialog", () => {
  it("renders the default title and description when open", () => {
    render(<FeatureComingSoonDialog open onOpenChange={() => {}} />);
    expect(screen.getByText("Fonctionnalité à venir")).toBeDefined();
    expect(
      screen.getByText("Cette fonctionnalité sera bientôt disponible."),
    ).toBeDefined();
  });

  it("renders a custom title and description", () => {
    render(
      <FeatureComingSoonDialog
        open
        onOpenChange={() => {}}
        title="Bientôt"
        description="Patientez."
      />,
    );
    expect(screen.getByText("Bientôt")).toBeDefined();
    expect(screen.getByText("Patientez.")).toBeDefined();
  });

  it("calls onOpenChange(false) when the action button is clicked", async () => {
    const onOpenChange = vi.fn();
    render(<FeatureComingSoonDialog open onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Compris" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders nothing when closed", () => {
    render(<FeatureComingSoonDialog open={false} onOpenChange={() => {}} />);
    expect(screen.queryByText("Fonctionnalité à venir")).toBeNull();
  });
});
