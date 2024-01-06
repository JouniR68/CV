// eslint-disable-next-line no-undef
const express = require("express");
const router = express.Router();

router.get("/alive", (req, res) => {
  return res.json({ data: "Elossa ollaan" }).end();
});

const checkPwd = (userPwd) => {
  const date = new Date();
  const month = date.getMonth();
  console.log("month: ", month);
  if (userPwd === `JRLA-${month + 1}`) {
    return true;
  } else {
    return false;
  }
};

router.post("/api/login", (req, res) => {
  console.log("req.body: ", req.body);
  const { userPwd } = req.body;
  const isPwdValid = checkPwd(userPwd);
  isPwdValid ? res.sendStatus(200) : res.sendStatus(204);
});

module.exports = router;
