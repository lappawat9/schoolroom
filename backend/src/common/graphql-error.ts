import { HttpException } from "@nestjs/common";
import { unwrapResolverError } from "@apollo/server/errors";
import { GraphQLError, GraphQLFormattedError } from "graphql";

export function formatGraphQLError(
  formatted: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError {
  const cause = unwrapResolverError(error);
  if (cause instanceof HttpException && cause.getStatus() < 500) {
    const status = cause.getStatus();
    const response = cause.getResponse();
    const originalError =
      typeof response === "string" ? { message: response } : response;
    const codes: Record<number, string> = {
      400: "BAD_USER_INPUT",
      401: "UNAUTHENTICATED",
      403: "FORBIDDEN",
      404: "NOT_FOUND",
      409: "CONFLICT",
    };
    const message =
      (originalError as { message?: string | string[] }).message ?? cause.message;
    return {
      message: Array.isArray(message) ? message.join(" · ") : message,
      path: formatted.path,
      locations: formatted.locations,
      extensions: {
        code: codes[status] ?? "BAD_USER_INPUT",
        status,
        originalError,
      },
    };
  }
  if (formatted.extensions?.code === "INTERNAL_SERVER_ERROR")
    return new GraphQLError("เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    }).toJSON();
  return formatted;
}
