import { fireEvent, render, screen } from "../../../test-utils";
import { NavBar } from "./NavBar";

test("", () => {
  const { history } = render(<NavBar />);
  const signInButton = screen.getByRole("button", { name: /sign in/i });
  fireEvent.click(signInButton);
  expect(history.location.pathname).toBe("/signin");
});
