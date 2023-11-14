const router = require("express").Router();
const {
    login,
} = require("../controllers/index.js");

//----------------------------- Login -----------------------------//
router.post("/login", async (req, res) => {
  const response = await login(req);
  res.status(response.status).json(response);
});

module.exports = router;
