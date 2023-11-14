const router = require("express").Router();
const {
  getLists,
  createListValue,
  editListValue,
} = require("../controllers/index.js");
//----------------------------- Get lists -----------------------------//
router.get("/:global?", async (req, res) => {
  const response = await getLists(req);
  res.status(response.status).json(response);
});
//----------------------------- Add value to list -----------------------------//
router.post("/", async (req, res) => {
  const response = await createListValue(req);
  res.status(response.status).json(response);
});
//----------------------------- Edit lists -----------------------------//
router.put("/:listId", async (req, res) => {
  const response = await editListValue(req);
  res.status(response.status).json(response);
});

module.exports = router;
