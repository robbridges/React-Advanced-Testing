import { App } from "../../../App";
import { fireEvent, render, screen } from "../../../test-utils";
import { NavBar } from "./NavBar";

const testUser = {
  email: "testing@test.com",
};

test("a blank user signing in will go to the signinaccount", () => {
  const { history } = render(<NavBar />);
  const signInButton = screen.getByRole("button", { name: /sign in/i });
  fireEvent.click(signInButton);
  expect(history.location.pathname).toBe("/signin");
});

test("a signout button should be available after a user signs in", () => {
  render(<App />, {
    preloadedState: { user: { userDetails: testUser } },
  });
  const signOutButton = screen.getByRole("button", { name: /sign out/i });
  expect(signOutButton).toBeInTheDocument();
});

test("clicking sign in button shows sign-in page if no user is provided", () => {
  render(<App />);
  const signInButton = screen.getByRole("button", { name: /sign in/i });
  fireEvent.click(signInButton);
  expect(
    screen.getByRole("heading", { name: /Sign in to your account/i })
  ).toBeInTheDocument();
});
