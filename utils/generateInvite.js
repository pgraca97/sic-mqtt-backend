import crypto from "crypto";

export function generateInvite() {
  return crypto.randomBytes(16).toString("hex");
}
