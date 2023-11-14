const router = require("express").Router();
const {
  getMaps,
  createMap,
  editMap,
  createPoint,
  editPoints,
} = require("../controllers/index.js");

//----------------------------- Get all or a single map -----------------------------//
router.get("/:mapId?", async (req, res) => {
  const response = await getMaps(req);
  res.status(response.status).json(response);
});

//-----------------------------  Create map  -----------------------------//
router.post("/", async (req, res) => {
  const response = await createMap(req);
  res.status(response.status).json(response);
});

//----------------------------- Edit map  -----------------------------//
router.put("/:mapId?", async (req, res) => {
  const response = await editMap(req);
  res.status(response.status).json(response);
});

//-----------------------------  Create map point  -----------------------------//
router.post("/points", async (req, res) => {
  const response = await createPoint(req);
  res.status(response.status).json(response);
});

//----------------------------- Edit map points  -----------------------------//
router.put("/points/:mapId?", async (req, res) => {
  const response = await editPoints(req);
  res.status(response.status).json(response);
});

module.exports = router;