const router = require("express").Router();
const {
  createBicycle,
  editBicycle,
} = require("../controllers/index.js");
const mediaUploads = require("../common/mediaUploads.js");

//----------------------------- Media management -----------------------------//
const files = mediaUploads();

//----------------------------- Create bicycle  -----------------------------//
router.post("/createBicycle", files.array("bike"), async (req, res) => {
  const response = await createBicycle(req);
  res.status(response.status).json(response);
});

//----------------------------- Edit bicycle  -----------------------------//
router.put("/editBicycle/:bicycleId", files.array("bike"), async (req, res) => {
  const response = await editBicycle(req);
  res.status(response.status).json(response);
});


module.exports = router;
