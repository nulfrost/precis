import type { HttpStatusEnum } from "elysia-http-status-code/status";

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
    | HttpStatusEnum.HTTP_401_UNAUTHORIZED
    | HttpStatusEnum.HTTP_429_TOO_MANY_REQUESTS;
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
