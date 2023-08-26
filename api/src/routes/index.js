const { Router } = require("express");
const router = Router();
const fs = require("fs");

const f = fs
  .readdirSync(__dirname)
  .filter((file) => file !== "index.js" && file.split(".").pop() === "js")
  .map((file) =>
    // example: router.use("/user", require("./user.js"));
    router.use(`/${file.slice(0, file.lastIndexOf("."))}`, require(`./${file}`))
  );

module.exports = router;
