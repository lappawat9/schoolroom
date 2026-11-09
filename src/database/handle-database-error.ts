import { ConflictException } from "@nestjs/common";
import { QueryFailedError } from "typeorm";

export function handleDatabaseError(
  error: unknown,
  duplicateMessage: string,
): never {
  if (error instanceof QueryFailedError) {
    const code = (error.driverError as { code?: string }).code;
    if (
      code === "ER_DUP_ENTRY" ||
      error.message.includes("UNIQUE constraint failed")
    ) {
      throw new ConflictException(duplicateMessage);
    }
  }
  throw error;
}
