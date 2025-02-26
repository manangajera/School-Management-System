import express from "express";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import User from "../Models/User.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const route = express.Router();

dotenv.config();
// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// route.post("/signup", async (req, res) => {
//   try {
//     const { fullName, email, phone, password } = req.body;

//     // First, check if user exists (await the result)
//     const existingUser = await User.findOne({ email: email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Upload image to Cloudinary
//     cloudinary.uploader.upload(
//       req.files.image.tempFilePath,
//       async (err, result) => {
//         if (err)
//           return res.status(500).json({ message: "Error uploading image" });

//         // Create user in database
//         const user = new User({
//           _id: new mongoose.Types.ObjectId(),
//           fullName,
//           email,
//           phone,
//           password: hashedPassword,
//           imageUrl: result.secure_url,
//           imageId: result.public_id,
//         });

//         await user
//           .save()
//           .then((user) => {
//             res.status(200).json({ message: "User created", user });
//           })
//           .catch((err) => {
//             res.status(500).json({ message: "Error creating user", err });
//           });
//       }
//     );
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ message: "Internal server error", error });
//   }
// });


route.post("/signup", async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload image to Cloudinary
    let uploadResult;
    try {
      uploadResult = await cloudinary.uploader.upload(req.files.image.tempFilePath);
    } catch (err) {
      return res.status(500).json({ message: "Error uploading image" });
    }

    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      fullName,
      email,
      phone,
      password: hashedPassword,
      imageUrl: uploadResult.secure_url,
      imageId: uploadResult.public_id,
    });

    await user.save();
    res.status(200).json({ message: "User created", user });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        imageUrl: user.imageUrl,
        imageId: user.imageId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Send response with token and minimal user data
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        imageUrl: user.imageUrl,
        imageId: user.imageId,
      },  
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default route;
