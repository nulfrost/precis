import crypto from "node:crypto";

export function generateApiKey() {
  const hexString = crypto.randomBytes(12).toString("hex");
  const dashedHexString = hexString.match(/.{1,4}/g)?.join("-");
  return dashedHexString;
}
