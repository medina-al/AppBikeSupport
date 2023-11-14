const router = require("express").Router();
const {
    getAllies,
    getAllyByUser,
    createAlly,
    editAlly,
    associateUser,
    handleAllyImage,
} = require("../controllers/index.js");
const mediaUploads = require("../common/mediaUploads.js");

//----------------------------- Media management -----------------------------//
const files = mediaUploads();

//----------------------------- Get all or a single ally -----------------------------//
router.get("/:allyId?", async (req, res) => {
  const response = await getAllies(req);
  res.status(response.status).json(response);
});

//----------------------------- Get ally by userId -----------------------------//
router.get("/user/:userId", async (req, res) => {
  const response = await getAllyByUser(req);
  res.status(response.status).json(response);
});


//----------------------------- Create ally -----------------------------//
router.post("/", async (req, res) => {
  const response = await createAlly(req);
  res.status(response.status).json(response);
});

//----------------------------- Edit ally -----------------------------//
router.put("/:allyId", async (req, res) => {
  const response = await editAlly(req);
  res.status(response.status).json(response);
});

//----------------------------- Associate user to ally -----------------------------//
router.put("/:allyId/:userId/:userType", async (req, res) => {
  const response = await associateUser(req);
  res.status(response.status).json(response);
});

//----------------------------- Handle ally images -----------------------------//
router.post("/image/:allyId/:imageId",files.array("ally"), async (req, res) => {
  const response = await handleAllyImage(req);
  res.status(response.status).json(response);
});

module.exports = router;