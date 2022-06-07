import { App } from "../../../App";
import { render, screen } from "../../../test-utils";

test.each([
  { routeName: "Home", routePath: "/", headingMatch: /welcome/i },
  { routeName: "Band 1", routePath: "/bands/1", headingMatch: /Joyous/i },
  { routeName: "Shows", routePath: "/shows", headingMatch: /Upcoming shows/i },
])(
  "$routeName page does not redirect to login screen",
  async ({ routePath, headingMatch }) => {
    render(<App />, { routeHistory: [routePath] });
    const heading = await screen.findByRole("heading", { name: headingMatch });
    expect(heading).toBeInTheDocument();
  }
);
