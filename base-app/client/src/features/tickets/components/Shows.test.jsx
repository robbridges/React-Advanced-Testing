import {
  fireEvent,
  getByRole,
  getByText,
  render,
  screen,
} from "../../../test-utils";
import { Shows } from "./Shows";

test("Correctly displays show details for non-sold-out show", async () => {
  render(<Shows />);
  const shows = await screen.findAllByRole("listitem");
  const nonSoldOutShow = shows[0];

  const ticketButton = getByRole(nonSoldOutShow, "button", {
    name: /tickets/i,
  });
  expect(ticketButton).toBeInTheDocument();
  const bandName = getByRole(nonSoldOutShow, "heading", {
    name: "avalanche of cheese",
  });
  expect(bandName).toBeInTheDocument();
  const bandDescription = getByText(
    nonSoldOutShow,
    "rollicking country with ambitious kazoo solos"
  );
  expect(bandDescription).toBeInTheDocument();
});

test("correct displays when show is sold out", async () => {
  render(<Shows />);
  const shows = await screen.findAllByRole("listitem");
  const soldOutShow = shows[1];
  const soldOutName = getByRole(soldOutShow, "heading", {
    name: "sold out",
  });
  expect(soldOutName).toBeInTheDocument();
});

test("redirects to correct tickets URL when tickets is clicked,", async () => {
  const { history } = render(<Shows />);

  const ticketsButton = await screen.findByRole("button", {
    name: /tickets/i,
  });
  fireEvent.click(ticketsButton);

  expect(history.location.pathname).toBe("/tickets/0");
});
