const router = require("express").Router();
const {
    getAssists,
    getOpenAssists,
    assignAssist,
    closeAssist,
    cancelAssist,
    createAssist,
    rateAssist,
} = require("../controllers/index.js");
const mediaUploads = require("../common/mediaUploads.js");

//----------------------------- Media management -----------------------------//
const files = mediaUploads();

//----------------------------- Get all assists close to an ally -----------------------------//
router.get("/open/:userId", async (req, res) => {
  const response = await getOpenAssists(req);
  res.status(response.status).json(response);
});

//----------------------------- Get all or a single assist -----------------------------//
router.get("/:userId/:userType/:assistId?", async (req, res) => {
  const response = await getAssists(req);
  res.status(response.status).json(response);
});

//-----------------------------  Assign assist to technician -----------------------------//
router.put("/assign/:assistId/:userId", async (req, res) => {
  const response = await assignAssist(req);
  res.status(response.status).json(response);
});


//-----------------------------  Cancel assist -----------------------------//
router.put("/cancel/:assistId/", async (req, res) => {
  const response = await cancelAssist(req);
  res.status(response.status).json(response);
});

//-----------------------------  Close assist -----------------------------//
router.put("/close/:assistId/", async (req, res) => {
  const response = await closeAssist(req);
  res.status(response.status).json(response);
});

//----------------------------- Create assist -----------------------------//
router.post("/",files.array("assist"), async (req, res) => {
  const response = await createAssist(req);
  res.status(response.status).json(response);
});

//-----------------------------  Rate assist -----------------------------//
router.put("/rate/:assistId/", async (req, res) => {
  const response = await rateAssist(req);
  res.status(response.status).json(response);
});

module.exports = router;