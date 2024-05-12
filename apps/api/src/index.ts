import { Elysia, NotFoundError, t } from "elysia";
import { and, asc, db, desc, eq, schema } from "@precis/database";
import {
  AuthenticationError,
  BadRequestError,
  RateLimitExceededError,
} from "../utils/errors";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses";
import { HttpStatusCode } from "elysia-http-status-code";
import { HttpStatusEnum } from "elysia-http-status-code/status";
import { helmet } from "elysia-helmet";
import { createPinoLogger, formatters } from "@bogeychan/elysia-logger";
import { ip } from "elysia-ip";
import { readRateLimit, writeRateLimit } from "../utils/rate-limit";
import { pluginGracefulServer } from "graceful-server-elysia";

const log = createPinoLogger({
  level: process.env.LOG_LEVEL || "info",
  formatters: {
    ...formatters,
    bindings(bindings) {
      return {
        pid: bindings.pid,
        host: bindings.hostname,
        time: new Date().toISOString(),
      };
    },
    level(label) {
      return { level: label.toUpperCase() };
    },
    log(object) {
      return formatters.log(object);
    },
  },
});

new Elysia({ name: "Precis API" })
  .use(helmet())
  .use(ip())
  .use(HttpStatusCode())
  .use(log.into({ autoLogging: false }))
  .use(
    pluginGracefulServer({
      readinessEndpoint: "/healthcheck",
      onStart: () => {
        log.info("[PRECIS API]: Server started successfully");
      },
    }),
  )
  .error({
    AUTHENTICATION_ERROR: AuthenticationError,
    BAD_REQUEST_ERROR: BadRequestError,
    RATE_LIMIT_EXCEEDED_ERROR: RateLimitExceededError,
  })
  .onError(({ code, error, httpStatus, set, ip, params: { guestbookId } }) => {
    switch (code) {
      case "AUTHENTICATION_ERROR":
        set.status = 401;
        log.error(
          {
            status: httpStatus.HTTP_401_UNAUTHORIZED,
            ip,
            err: {
              stack: error.stack,
            },
            guestbookId,
          },
          error.message.toString(),
        );
        return sendErrorResponse({
          status: httpStatus.HTTP_401_UNAUTHORIZED,
          title: "Error: unauthorized",
          detail: error.message.toString(),
        });
      case "BAD_REQUEST_ERROR":
        set.status = 400;
        log.error(
          {
            status: httpStatus.HTTP_400_BAD_REQUEST,
            ip,
            err: {
              stack: error.stack,
            },
            guestbookId,
          },
          error.message.toString(),
        );
        return sendErrorResponse({
          status: httpStatus.HTTP_400_BAD_REQUEST,
          title: "Error: bad request",
          detail: error.message.toString(),
        });
      case "RATE_LIMIT_EXCEEDED_ERROR":
        set.status = 429;
        return sendErrorResponse({
          status: httpStatus.HTTP_429_TOO_MANY_REQUESTS,
          title: "Error: rate limit exceeded",
          detail: error.message.toString(),
        });
      case "NOT_FOUND":
        log.error(
          {
            status: httpStatus.HTTP_404_NOT_FOUND,
            ip,
            err: {
              stack: error.stack,
            },
            guestbookId,
          },
          error.message.toString(),
        );
        return sendErrorResponse({
          status: httpStatus.HTTP_404_NOT_FOUND,
          title: "Error: resource not found",
          detail:
            "Resource requested could not be found on the server. Please make sure your request is valid.",
        });
      case "INTERNAL_SERVER_ERROR":
        set.status = 500;
        log.error(
          {
            status: httpStatus.HTTP_500_INTERNAL_SERVER_ERROR,
            ip,
            err: {
              stack: error.stack,
            },
            guestbookId,
          },
          error.message.toString(),
        );
        return sendErrorResponse({
          status: httpStatus.HTTP_500_INTERNAL_SERVER_ERROR,
          title: "Error: unhandled error",
          detail:
            "An unhandled error occurred on the server. Please try again later.",
        });
    }
  })
  .group("/v1", (app) =>
    app
      .guard({
        params: t.Object({
          guestbookId: t.String(),
        }),
        headers: t.Object({
          "x-precis-api-key": t.String(),
        }),
        async beforeHandle({ params: { guestbookId }, headers }) {
          // check if api key is being sent in header
          if (!headers["x-precis-api-key"]) {
            throw new AuthenticationError(
              "Invalid API key provided. Please provide a valid API key to access this resource.",
            );
          }
          // check if guestbook and api key exists
          const guestbook = await db.query.guestbooks.findFirst({
            where: and(
              eq(schema.guestbooks.id, guestbookId),
              eq(schema.guestbooks.api_key, headers["x-precis-api-key"]),
            ),
          });

          if (typeof guestbook === "undefined") {
            throw new BadRequestError(
              "The guestbook requested does not exist or the api key is invalid. Please make sure your credentials are correct.",
            );
          }
        },
      })
      .get(
        "/guestbooks/:guestbookId/messages",
        async ({
          params: { guestbookId },
          ip,
          set,
          query: { amount, created_at, page },
        }) => {
          const { success, limit, remaining, reset } =
            await readRateLimit.limit(ip);
          if (!success) {
            set.headers["x-rate-limit-limit"] = limit.toString();
            set.headers["x-rate-limit-remaining"] = remaining.toString();
            set.headers["x-rate-limit-reset"] = reset.toString();
            throw new RateLimitExceededError(
              "Rate limit exceeded. Please try again later.",
            );
          }

          const fetchAmount = amount ? +amount : 25;

          if (
            isNaN(fetchAmount) ||
            !["25", "50", "75", "100"].includes(fetchAmount.toString())
          )
            throw new BadRequestError(
              "Invalid amount provided. Please provide one of the following: 25, 50, 75, 100.",
            );

          if (created_at && !["asc", "desc"].includes(created_at)) {
            throw new BadRequestError(
              "Invalid sort order provided. Please provide either 'asc' or 'desc'.",
            );
          }

          if (page && isNaN(+page)) {
            throw new BadRequestError("Page must be a number.");
          }

          const guestbook = await db.query.guestbooks.findFirst({
            where: eq(schema.guestbooks.id, guestbookId),
            offset: page ? (+page - 1) * (fetchAmount ?? 25) : 0,
            with: {
              messages: {
                limit: fetchAmount ?? 25,
                orderBy: [
                  created_at === "asc"
                    ? asc(schema.messages.created_at)
                    : desc(schema.messages.created_at),
                ],
                columns: {
                  id: true,
                  username: true,
                  message: true,
                  created_at: true,
                  updated_at: true,
                },
              },
            },
          });

          if (typeof guestbook !== "undefined") {
            return {
              data: guestbook?.messages,
            };
          }
          return {
            data: [],
          };
        },
        {
          query: t.Object({
            amount: t.Optional(t.String()),
            created_at: t.Optional(t.String()),
            page: t.Optional(t.String()),
          }),
        },
      )
      .post(
        "/guestbooks/:guestbookId/messages",
        async ({ params: { guestbookId }, body, set, ip }) => {
          const { success, limit, remaining, reset } =
            await writeRateLimit.limit(ip);
          if (!success) {
            set.headers["x-rate-limit-limit"] = limit.toString();
            set.headers["x-rate-limit-remaining"] = remaining.toString();
            set.headers["x-rate-limit-reset"] = reset.toString();
            throw new RateLimitExceededError(
              "Rate limit exceeded. Please try again later.",
            );
          }
          await db.insert(schema.messages).values({
            username: body.username,
            message: body.message,
            guestbook_id: guestbookId,
          });

          set.status = 201;

          return {
            ...sendSuccessResponse({
              status: HttpStatusEnum.HTTP_201_CREATED,
              title: "Success: message created",
              detail: "The message has been successfully created.",
            }),
          };
        },
        {
          body: t.Object({
            username: t.String(),
            message: t.String(),
          }),
        },
      ),
  )
  .get(
    "/",
    () => `
      Hello, friend! Check out this project @ https://precis.dev
      uptime: ${process.uptime()}
    `,
  )
  .all("*", () => {
    throw new NotFoundError();
  })
  .listen(process.env.PORT || 4000);
