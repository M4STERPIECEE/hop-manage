// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { Button } from "src/shared/ui/button";
import { afterEach, describe, expect, it } from "vitest";
import { ButtonGroup } from "../button-group";

afterEach(() => cleanup());

describe("ButtonGroup", () => {
  it("renders a group containing its button children", () => {
    render(
      <ButtonGroup>
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole("group");
    expect(group).toBeDefined();
    expect(screen.getByText("One")).toBeDefined();
    expect(screen.getByText("Two")).toBeDefined();
  });

  it("merges a custom className onto the container", () => {
    render(
      <ButtonGroup className="custom-x">
        <Button>One</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("group").className).toContain("custom-x");
  });
});
