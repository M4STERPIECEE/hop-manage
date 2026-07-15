// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { useAppForm } from "../form-setup";

function Harness() {
  const form = useAppForm({ defaultValues: { credit: false } });
  return (
    <>
      <form.AppField name="credit">
        {(f) => <f.CheckboxField label="Crédit" />}
      </form.AppField>
      <form.Subscribe selector={(s) => s.values.credit}>
        {(credit) => <output>{credit ? "on" : "off"}</output>}
      </form.Subscribe>
    </>
  );
}

afterEach(() => {
  cleanup();
});

describe("CheckboxField", () => {
  it("renders the label", () => {
    render(<Harness />);
    expect(screen.getByText("Crédit")).toBeDefined();
  });

  it("toggles the form value when clicked", async () => {
    render(<Harness />);
    expect(screen.getByText("off")).toBeDefined();
    await userEvent.click(screen.getByRole("checkbox"));
    expect(screen.getByText("on")).toBeDefined();
  });
});
