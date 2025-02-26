import express from "express";
import Fee from "../Models/Fee.js";
import { checkAuth } from "../Middlewares/checkAuth.js";
import mongoose from "mongoose";
const route = express.Router();

// Add fee
route.post("/add-fee", checkAuth, async (req, res) => {
  try {
    const { fullName, phone, courseId,amount, remark } = req.body;
    const userId = req.userId;
    // Validate required fields
    if (!fullName || !phone || !courseId  || !amount || !remark) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const fee = new Fee({
      _id: new mongoose.Types.ObjectId(),
      fullName, 
      phone,
      courseId,
      uId: userId,
      amount,
      remark,
    });
    await fee.save();

    res.status(200).json({
      success: true,
      message: "Fee added successfully",
      fee,
    });
  } catch (error) {
    console.error("Error adding fee:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add fee",
      error: error.message,
    });
  }
});

// Get all fees
route.get("/payment-history", checkAuth, async (req, res) => {
  const userId = req.userId;
  Fee.find({ uId: userId })
    .then((fees) => {
      res.status(200).json({ fees });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error fetching fees" });
    }); 
});

// get all payment for any student in course
route.get("/all-payment", checkAuth, async (req, res) => {
  const userId = req.userId;
  Fee.find({ uId: userId, courseId: req.query.courseId ,phone:req.query.phone})
    .then((fees) => {
      res.status(200).json({ fees });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error fetching fees" });
    });
});
export default route;
