import type { HttpStatusEnum } from "elysia-http-status-code/status";

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function sendSuccessResponse({
  status,
  title,
  detail,
}: {
  status: HttpStatusEnum;
  title: string;
  detail: string;
}) {
  return {
    data: {
      status,
      title,
      detail,
    },
  };
}

export function sendErrorResponse({
  status,
  title,
  detail,
}: {
  status:
    | HttpStatusEnum.HTTP_400_BAD_REQUEST
    | HttpStatusEnum.HTTP_404_NOT_FOUND
    | HttpStatusEnum.HTTP_500_INTERNAL_SERVER_ERROR
    | HttpStatusEnum.HTTP_401_UNAUTHORIZED;
  title: string;
  detail: string;
}) {
  return {
    data: {
      status,
      title,
      detail,
    },
  };
}
