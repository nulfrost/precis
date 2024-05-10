import { Elysia, NotFoundError, t } from "elysia";
import { and, db, eq, schema } from "@precis/database";
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
  .error({
    AUTHENTICATION_ERROR: AuthenticationError,
    BAD_REQUEST_ERROR: BadRequestError,
    RATE_LIMIT_EXCEEDED: RateLimitExceededError,
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
          title: "Error: could not find guestbook",
          detail: error.message.toString(),
        });
      case "RATE_LIMIT_EXCEEDED":
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
  .group("/api/v1", (app) =>
    app
      .guard({
        params: t.Object({
          guestbookId: t.String(),
        }),
        headers: t.Object({
          "x-precis-key": t.String(),
        }),
        async beforeHandle({ params: { guestbookId }, headers }) {
          // check if api key is being sent in header
          if (!headers["x-precis-key"]) {
            throw new AuthenticationError(
              "Invalid API key provided. Please provide a valid API key to access this resource.",
            );
          }
          // check if guestbook and api key exists
          const guestbook = await db.query.guestbooks.findFirst({
            where: and(
              eq(schema.guestbooks.id, guestbookId),
              eq(schema.guestbooks.api_key, headers["x-precis-key"]),
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
        async ({ params: { guestbookId }, ip, set }) => {
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

          const guestbook = await db.query.guestbooks.findFirst({
            where: eq(schema.guestbooks.id, guestbookId),
            with: {
              messages: {
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
          return {
            data: guestbook?.messages,
          };
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
  .all("*", () => {
    throw new NotFoundError();
  })
  .listen(process.env.PORT || 4000);
