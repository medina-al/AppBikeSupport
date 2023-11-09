const router = require("express").Router();
const {
    getLists,
} = require("../controllers/index.js");
//----------------------------- Get all or a single map -----------------------------//
router.get("/:global", async (req, res) => {
  const response = await getLists(req);
  res.status(response.status).json(response);
});

module.exports = router;