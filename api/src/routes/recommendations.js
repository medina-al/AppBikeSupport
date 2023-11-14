const router = require("express").Router();
const {
  getRecommendations,
  createRecommendation,
  editRecommendation,
  handleRecImage,
} = require("../controllers/index.js");
const mediaUploads = require("../common/mediaUploads.js");

//----------------------------- Media management -----------------------------//
const files = mediaUploads();

//----------------------------- Get all or a single recommendations -----------------------------//
router.get("/:recId?", async (req, res) => {
  const response = await getRecommendations(req);
  res.status(response.status).json(response);
});

//----------------------------- Create recommendation -----------------------------//
router.post("/", files.array("recommendation"), async (req, res) => {
  const response = await createRecommendation(req);
  res.status(response.status).json(response);
});

//----------------------------- Edit recommendation -----------------------------//
router.put("/:recId", async (req, res) => {
  const response = await editRecommendation(req);
  res.status(response.status).json(response);
});

//----------------------------- Handle images -----------------------------//
router.put(
  "/image/:recId/:imageId",
  files.single("recommendation"),
  async (req, res) => {
    const response = await handleRecImage(req);
    res.status(response.status).json(response);
  }
);

module.exports = router;
