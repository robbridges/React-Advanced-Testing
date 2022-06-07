import userEvent from "@testing-library/user-event";

import { App } from "../../../App";
import { getByRole, render, screen, waitFor } from "../../../test-utils";

test.each([
  { routePath: "/profile" },
  { routePath: "/tickets/0" },
  { routePath: "/confirm/0?holdId=123&seatCount=2" },
])(
  "Should redirect back to main page if not logged in and try to go to profile route",
  ({ routePath }) => {
    render(<App />, { routeHistory: [routePath] });
    const heading = screen.getByRole("heading", { name: /sign in/i });
    expect(heading).toBeInTheDocument();
  }
);

test("successful sign-in flow", async () => {
  const { history } = render(<App />, { routeHistory: ["/tickets/1"] });
  const emailField = screen.getByLabelText(/email/i);
  userEvent.type(emailField, "test@test.com");

  const passwordField = screen.getByLabelText(/password/i);
  userEvent.type(passwordField, "yoooo");

  const signInForm = screen.getByTestId("sign-in-form");
  const signInButton = getByRole(signInForm, "button", { name: /sign in/i });
  userEvent.click(signInButton);
  await waitFor(() => {
    // expect(history.location.pathname).toBe("/tickets/1");
    expect(history.entries).toHaveLength(1);
  });
});
