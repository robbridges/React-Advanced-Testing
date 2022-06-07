import { response, rest } from "msw";

import { baseUrl, endpoints } from "../app/axios/constants";
import { bandUrl } from "../features/band/redux/bandApi";
import { showsUrl } from "../features/tickets/redux/showApi";
import { bands, shows } from "../test-utils/fake-data";

const authHandler = (req, res, ctx) => {
  const { email } = req.body;
  const user = { email, token: "abc", id: 1 };
  return res(ctx.json({ user }));
};

export const handlers = [
  rest.get(showsUrl, (req, res, ctx) => {
    return res(ctx.json({ shows }));
  }),
  rest.get(`${bandUrl}/:bandId`, (req, res, ctx) => {
    const { bandId } = req.params;

    return res(ctx.json({ band: bands[bandId] }));
  }),
  rest.get(`${bandUrl}/:bandId`, (req, res, ctx) => {
    const { bandId } = req.params;

    return res(ctx.json({ band: bands[bandId] }));
  }),
  rest.get(`${showsUrl}/:showId`, (req, res, ctx) => {
    const { showId } = req.params;

    return res(ctx.json({ show: shows[showId] }));
  }),
  rest.patch(`${showsUrl}/:showId/hold/:holdId`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.post(`${baseUrl}/${endpoints.signIn}`, authHandler),
  rest.post(`${baseUrl}/${endpoints.signUp}`, authHandler),
];
