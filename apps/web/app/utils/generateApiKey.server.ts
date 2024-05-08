import crypto from "node:crypto";

export function generateApiKey() {
  return crypto.randomBytes(12).toString("hex");
}
