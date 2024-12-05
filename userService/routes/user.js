const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Create user
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// REQUIRE: req.body include {name}
// RETURN: user
router.post(
  "/create",
  userController.authenticateToken,
  userController.createUser
);

// Update user
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// REQUIRE: req.body include {name}
// RETURN: user
router.put(
  "/update",
  userController.authenticateToken,
  userController.updateUser
);

// get user
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: user
router.get("/get", userController.authenticateToken, userController.getUser);

router.get("/", (req, res, next) => {
  res.send({ msg: "User service" });
});

module.exports = router;
