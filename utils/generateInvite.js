const crypto = require("crypto");

function generateInvite() {
  return crypto.randomBytes(16).toString("hex");
}

module.exports = generateInvite;
