import { render, screen } from "../../../test-utils";
import { UserProfile } from "./UserProfile";

const testUser = {
  email: "testing@test.com",
};

test("greets the user", () => {
  render(<UserProfile />, {
    preloadedState: { user: { userDetails: testUser } },
  });
  expect(screen.getByText(/hi, testing@test.com/i)).toBeInTheDocument();
});

test("redirects if user is falsy", () => {
  const { history } = render(<UserProfile />);
  expect(history.location.pathname).toBe("/signin");
});
