const express = require("express");
const router = express.Router();

const User = require("../models/userModel");
const {
  updateProfile,
  blockUser,
  unBlockUser,
  addFriend,
  removeFriend,
  findUserByEmail,
  findUserByID,
  loginUser,
  signupUser,
} = require("../controllers/userController");
const upload = require("../middleware/multer");

const defaultClientUrl = "http://localhost:3000"; // Default client URL for web

router.get("/logout", function (req, res) {
  req.logOut(); // remove all session data req.session = null;
  res.redirect("http://localhost:3000/signin ");
});
// Custom user functions
// router.patch("/profile/:userId", upload.single("profilePicture"), updateProfile);
router.patch(
  "/profile/:userId",
  upload.fields([{ name: "profilePicture", maxCount: 1 },{ name: "coverPicture", maxCount: 1 }]),
  updateProfile
);

router.post("/profile/block", blockUser);
router.post("/profile/unblock", unBlockUser);
router.post("/profile/find", findUserByEmail);
router.post("/profile/findbyid", findUserByID);
router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/add-friend", addFriend);
router.post("/remove-friend", removeFriend);

module.exports = router;
