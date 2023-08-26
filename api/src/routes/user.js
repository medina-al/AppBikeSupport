const router = require("express").Router();
const {
  getUsers,
} = require("../controllers/index.js");
const mediaUploads = require("../common/mediaUploads");

//----------------------------- Media management -----------------------------//
const profileImg = mediaUploads();

//----------------------------- Get all or a single user -----------------------------//
router.get("/:userId?", async (req, res) => {
  const response = await getUsers(req);
  res.status(response.status).json(response);
});

module.exports = router;
