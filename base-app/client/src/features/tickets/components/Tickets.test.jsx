import { App } from "../../../App";
import { fireEvent, render, screen } from "../../../test-utils";

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

test("'purchase' button pushes the correct URL", async () => {
  const { history } = render(<App />, {
    preloadedState: { user: { userDetails: testUser } },
    routeHistory: ["/tickets/0"],
  });

  const purchaseButton = await screen.findByRole("button", {
    name: /purchase/i,
  });

  fireEvent.click(purchaseButton);

  expect(history.location.pathname).toBe("/confirm/0");
  const searchRegex = expect.stringMatching(/holdId=\d+&seatCount=2/i);
  expect(history.location.search).toEqual(searchRegex);
});
