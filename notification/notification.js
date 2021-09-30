const push = require("web-push");

push.setVapidDetails(
  "mailto:test@test.com",
  process.env.PUBLIC_KEY,
  process.env.PRIVATE_KEY
);

module.exports = {
  push: push,
};
