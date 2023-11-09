const router = require("express").Router();
const {
  getUsers,
  createAccount,
  verifyAccount
} = require("../controllers/index.js");
const mediaUploads = require("../common/mediaUploads.js");

//----------------------------- Media management -----------------------------//
const files = mediaUploads();

//----------------------------- Get all or a single user -----------------------------//
router.get("/:userId?", async (req, res) => {
  const response = await getUsers(req);
  res.status(response.status).json(response);
});

//----------------------------- Create user account  -----------------------------//
router.post("/createAccount", files.single("profile"), async (req, res) => {
  const response = await createAccount(req);
  res.status(response.status).json(response);
});

//----------------------------- Verify user account  -----------------------------//
router.post("/verifyAccount", async (req, res) => {
  const response = await verifyAccount(req);
  res.status(response.status).json(response);
});


module.exports = router;
