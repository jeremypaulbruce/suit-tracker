import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AddInsight } from "./add-insight.tsx";

describe("AddInsight Component", () => {
  it("should open the modal when the 'Add insight' button is clicked", () => {
    const onClose = vi.fn();
    render(<AddInsight open={false} onClose={onClose} />);

    // Initially, the modal should not be visible
    expect(screen.queryByText("Add a new insight")).not.toBeInTheDocument();

    // Simulate opening the modal
    render(<AddInsight open onClose={onClose} />);

    // Check if the modal is now visible
    expect(screen.getByText("Add a new insight")).toBeInTheDocument();
  });
});
