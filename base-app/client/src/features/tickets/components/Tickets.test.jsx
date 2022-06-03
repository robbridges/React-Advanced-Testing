import { App } from "../../../App";
import { render, screen } from "../../../test-utils";

const testUser = {
  email: "testing@test.com",
};

test("Authenticated user should be able to see a show", async () => {
  render(<App />, {
    preloadedState: { user: { userDetails: testUser } },
    routeHistory: ["/tickets/0"],
  });

  const heading = await screen.findByRole("heading", {
    name: /Avalanche of Cheese/i,
  });
  expect(heading).toBeInTheDocument();
});
