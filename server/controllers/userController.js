const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const {
  uploadOnCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");

function generate4DigitOTP() {
  const min = 1000; // Minimum 4-digit number (1000)
  const max = 9999; // Maximum 4-digit number (9999)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// verify function to verify user and send OTP to email
const verifyUser = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.verifyUser(email);
    const otp = generate4DigitOTP();

    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = Date.now() + 600000;
    await sendOTPByEmail(email, otp);
    res.status(200).json({ message: "OTP sent to your email, OTP is:", otp });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const updateData = { ...req.body };
  console.log("Update profile" + JSON.stringify(updateData, null, 2));
  try {
    const user = await User.findById(userId);
    console.log("User" + user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (req.files) {
      if (req.files.profilePicture) {
        // If the user already has a profile picture, delete the old one

        if (user.profilePicturePublicId) {
          await deleteFromCloudinary(user.profilePicturePublicId);
        }

        const profilePicResult = await uploadOnCloudinary(
          req.files.profilePicture[0].buffer
        );

        if (profilePicResult && profilePicResult.secure_url) {
          updateData.profilePicture = profilePicResult.secure_url;
          updateData.profilePicturePublicId = profilePicResult.public_id; // Save the public_id for future deletions
        }
      }

      if (req.files.coverPicture) {
        if (user.coverPicturePublicId) {
          await deleteFromCloudinary(user.coverPicturePublicId);
        }

        const coverPicResult = await uploadOnCloudinary(
          req.files.coverPicture[0].buffer
        );

        if (coverPicResult && coverPicResult.secure_url) {
          updateData.coverPicture = coverPicResult.secure_url;
          updateData.coverPicturePublicId = coverPicResult.public_id;
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const blockUser = async (req, res) => {
  const { userID } = req.body;

  try {
    let user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.blocked = true;
    // Save the updated user
    await user.save();

    // Return the updated user as response
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error blocking user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const unBlockUser = async (req, res) => {
  const { userID } = req.body;

  try {
    // Find the user by ID
    let user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.blocked = false;
    // Save the updated user
    await user.save();

    // Return the updated user as response
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error blocking user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const findUserByEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error blocking user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const findUserByID = async (req, res) => {
  console.log("Find user by id");
  const { userID } = req.body;
  try {
    let user = await User.findById(userID).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error blocking user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// sendOTPByEmail function to send OTP to email
async function sendOTPByEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "axsad398@gmail.com",
      pass: "fgcr ahol fkjg zdnz",
    },
  });

  const mailOptions = {
    from: "axsad398@gmail.com",
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
}

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: "3d" });
};

// Custom Authentication
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);

    // Create a new object with only the fields we want to send to the frontend
  
    res.status(200).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const signupUser = async (req, res) => {
  console.log("Signup user");
  const { name, username, email, password } = req.body;
  console.log(req.body);
  console.log(name, username, email, password);
  try {
    const user = await User.signup(name, username, email, password);
    const token = createToken(user._id);

    const userResponse = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      // Add any other non-sensitive fields you want to include
    };

    res.status(200).json({
      success: true,
      user: userResponse,
      token,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Add a friend
const addFriend = async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    // Check if both users exist
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Check if they are already friends
    if (user.friends.includes(friendId)) {
      return res
        .status(400)
        .json({ success: false, error: "Users are already friends" });
    }

    // Add friend to user's friend list
    user.friends.push(friendId);
    await user.save();

    // Add user to friend's friend list
    friend.friends.push(userId);
    await friend.save();

    res
      .status(200)
      .json({ success: true, message: "Friend added successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Remove a friend
const removeFriend = async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    // Check if both users exist
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Check if they are friends
    if (!user.friends.includes(friendId)) {
      return res
        .status(400)
        .json({ success: false, error: "Users are not friends" });
    }

    // Remove friend from user's friend list
    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    await user.save();

    // Remove user from friend's friend list
    friend.friends = friend.friends.filter((id) => id.toString() !== userId);
    await friend.save();

    res
      .status(200)
      .json({ success: true, message: "Friend removed successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  updateProfile,
  blockUser,
  unBlockUser,
  findUserByEmail,
  verifyUser,
  findUserByID,
  loginUser,
  signupUser,
  addFriend,
  removeFriend,
};
