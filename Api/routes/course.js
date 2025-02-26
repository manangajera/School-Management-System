import express from "express";
import { checkAuth } from "../Middlewares/checkAuth.js";
import Course from "../Models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Student from "../Models/Student.js";
const route = express.Router();

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Add course
route.post("/add-course", checkAuth, async (req, res) => {
  const { courseName, description, price, startDate, endDate } = req.body;
  const userId = req.userId;
  cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    async (error, result) => {
      if (error)
        return res.status(500).json({ message: "Error uploading image" });
      const course = new Course({
        _id: new mongoose.Types.ObjectId(),
        courseName,
        description,
        price,
        startDate,
        endDate,
        ImageUrl: result.secure_url,
        ImageId: result.public_id,
        uId: userId,
      });
      await course
        .save()
        .then((course) => {
          res
            .status(200)
            .json({ message: "Course added successfully", course });
        })
        .catch((error) => {
          res.status(500).json({ message: "Error adding course" });
        });
    }
  );
});

// Get all courses
route.get("/all-courses", checkAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const courses = await Course.find({ uId: userId });
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses" });
  }
});

// Get course by id
route.get("/course-details/:id", checkAuth, async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById({ _id: courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    Student.find({ courseId: courseId })
    .then((students) => { 
      res.status(200).json({ course, students });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error fetching students" });
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching course details" });
  }
});

// delete course
route.delete("/delete-course/:id", checkAuth, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.userId;

    const course = await Course.findById({ _id: courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.uId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this course" });
    }

    await Course.findByIdAndDelete(courseId);
    await cloudinary.uploader.destroy(course.ImageId);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course" });
  }
});

// update course
route.put("/update-course/:id", checkAuth, async (req, res) => {
  try {
    const courseId = req.params.id;
    const { courseName, description, price, startDate, endDate } = req.body;
    const userId = req.userId;
    
    const course = await Course.findById({ _id: courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    if (course.uId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this course" });
    }

    let imageUrl = course.ImageUrl;
    let imageId = course.ImageId;

    if (req.files) {
      await cloudinary.uploader.destroy(course.ImageId);
      const result = await cloudinary.uploader.upload(req.files.image.tempFilePath);
      imageUrl = result.secure_url;
      imageId = result.public_id;
    }

    const updatedCourse = {
      courseName,
      description,
      price,
      startDate,
      endDate,
      ImageUrl: imageUrl,
      ImageId: imageId,
    };

    const updatedCourseDoc = await Course.findByIdAndUpdate(
      courseId,
      updatedCourse,
      { new: true }
    );

    res.status(200).json({ 
      message: "Course updated successfully", 
      course: updatedCourseDoc 
    });

  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: "Error updating course" });
  }
});


route.get("/latest-courses", checkAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const courses = await Course.find({ uId: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    if (!courses || courses.length === 0) {
      return res.status(404).json({
        message: "No courses found",
        details: "No courses are currently associated with this user"
      }); 
    }

    res.status(200).json({ courses });
  } catch (error) {
    console.error('Error fetching latest courses:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation error",
        error: error.message
      });
    }
    
    res.status(500).json({
      message: "Internal server error",
      details: "An error occurred while fetching latest courses"
    });
  }
});

export default route;
