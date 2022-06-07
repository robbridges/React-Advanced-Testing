import userEvent from "@testing-library/user-event";
import { rest, RestRequest, DefaultRequestBody, RequestParams, ResponseComposition, RestContext } from "msw";
import { baseUrl, endpoints } from "../../../app/axios/constants";
import { App } from "../../../App";
import { handlers } from "../../../mocks/handlers";
import { getByRole, render, screen, waitFor } from "../../../test-utils";
import { server } from "../../../mocks/server";

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

test.each([
  { testName: "sign in", buttonName: /sign in/i },
  { testName: "sign up", buttonName: /sign up/i },
])("successful $testName flow", async ({ buttonName }) => {
  
  const { history } = render(<App />, { routeHistory: ["/tickets/0"] });

  
  const emailField = screen.getByLabelText(/email address/i);
  userEvent.type(emailField, "test@test.com");

  const passwordField = screen.getByLabelText(/password/i);
  userEvent.type(passwordField, "test");

  const form = screen.getByTestId("sign-in-form");
  const signInButton = getByRole(form, "button", { name: buttonName });
  userEvent.click(signInButton);

  await waitFor(() => {
    // Test for redirect back to initial protected page
    expect(history.location.pathname).toBe("/tickets/0");

    // with sign-in page removed from history
    expect(history.length).toBe(1);
  });
});

const signInFailure = (
  req: RestRequest<DefaultRequestBody, 
  RequestParams>, 
  res: ResponseComposition, 
  ctx: RestContext
) => {
  return res(ctx.status(401));
}
const serverError = (
  req: RestRequest<DefaultRequestBody, 
  RequestParams>, 
  res: ResponseComposition, 
  ctx: RestContext
) => { 
  return res(ctx.status(500));
}

const signUpFailure = (
  req: RestRequest<DefaultRequestBody, 
  RequestParams>, 
  res: ResponseComposition, 
  ctx: RestContext
) => { 
  return res(ctx.status(500))
}
const signUpServerError = (
  req: RestRequest<DefaultRequestBody, RequestParams>, 
  res: ResponseComposition, 
  ctx: RestContext
) => { 
  return res(ctx.status(400))
}

test("unsuccessful signin followed by successful signin", async () => {
  const errorHandler = rest.post(
    `${baseUrl}/${endpoints.signIn}`,
    signInFailure
  );
  server.resetHandlers(...handlers, errorHandler);
  const { history } = render(<App />, { routeHistory: ["/tickets/0"] });

  
  const emailField = screen.getByLabelText(/email address/i);
  userEvent.type(emailField, "test@test.com");

  const passwordField = screen.getByLabelText(/password/i);
  userEvent.type(passwordField, "test");

  const form = screen.getByTestId("sign-in-form");
  const signInButton = getByRole(form, "button", { name: /sign in/i });
  userEvent.click(signInButton);
  server.restoreHandlers();

  userEvent.click(signInButton)

  await waitFor(() => {
    // Test for redirect back to initial protected page
    expect(history.location.pathname).toBe("/tickets/0");

    // with sign-in page removed from history
    expect(history.length).toBe(1);
  });
})



test.each([
  {
    endpoint: endpoints.signIn,
    outcome: "failure",
    responseResolver: signInFailure,
    buttonNameRegex: /sign in/i,
  },
  {
    endpoint: endpoints.signIn,
    outcome: "server error",
    responseResolver: serverError,
    buttonNameRegex: /sign in/i,
  },
  {
    endpoint: endpoints.signUp,
    outcome: "failure",
    responseResolver: signUpFailure,
    buttonNameRegex: /sign up/i,
  },
  {
    endpoint: endpoints.signUp,
    outcome: "error",
    responseResolver: serverError,
    buttonNameRegex: /sign in/i,
  },
])(
  "$endpoint $outcome followed by successful signin",
  async ({ endpoint, responseResolver, buttonNameRegex }) => {
    // reset the handler to respond as though signin failed
    const errorHandler = rest.post(`${baseUrl}/${endpoint}`, responseResolver);
    server.resetHandlers(errorHandler);

    const { history } = render(<App />, { routeHistory: ["/tickets/0"] });

    // Sign in (after redirect)
    const emailField = screen.getByLabelText(/email address/i);
    userEvent.type(emailField, "test@test.com");

    const passwordField = screen.getByLabelText(/password/i);
    userEvent.type(passwordField, "test");

    const form = screen.getByTestId("sign-in-form");
    const signInButton = getByRole(form, "button", { name: buttonNameRegex });
    userEvent.click(signInButton);

    // reset handlers to default to simulate a correct sign-in
    server.resetHandlers();

    // no need to re-enter info, just click button
    userEvent.click(signInButton);

    await waitFor(() => {
      // Test for redirect back to initial protected page
      expect(history.location.pathname).toBe("/tickets/0");

      // with sign-in page removed from history
      expect(history.length).toBe(1);
    });
  }
);