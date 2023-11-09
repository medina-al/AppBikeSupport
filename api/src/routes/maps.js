const router = require("express").Router();
const {
    getMaps,
} = require("../controllers/index.js");
//----------------------------- Get all or a single map -----------------------------//
router.get("/:mapId?", async (req, res) => {
  const response = await getMaps(req);
  res.status(response.status).json(response);
});

module.exports = router;