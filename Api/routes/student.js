import express from "express";
import { checkAuth } from "../Middlewares/checkAuth.js";
import Student from "../Models/Student.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Course from "../Models/Course.js";
const route = express.Router();

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Add student
route.post("/add-student", checkAuth, async (req, res) => {
  try {
    const { fullName, email, phone, address, courseId } = req.body;

      const userId = req.userId;
    // Validate required fields
    if (!fullName || !email || !phone || !address || !courseId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if course exists and handle potential errors
    let course;
    try {
      course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ 
          message: "Course not found", 
          details: "The specified course does not exist. Please verify the course ID."
        });
      }
    } catch (courseError) {
      console.error('Error fetching course:', courseError);
      return res.status(400).json({ 
        message: "Invalid course ID", 
        details: "Unable to fetch course information. Please check if the course ID is correct."
      });
    }

    if (course.uId !== userId) {
      return res.status(403).json({ 
        message: "Unauthorized access to this course",
        details: "You don't have permission to add students to this course"
      });
    }

    // Check if student with same email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(409).json({ message: "Student with this email already exists" });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    const student = new Student({
      _id: new mongoose.Types.ObjectId(),
      fullName,
      email,
      phone,
      address,
      ImageId: uploadResult.public_id,
      ImageUrl: uploadResult.secure_url,
      courseId,
      uId: userId,
    });

    await student.save();
    res.status(201).json({ message: "Student added successfully", student });

  } catch (error) {
    console.error('Error adding student:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: "Validation error", error: error.message });
    }
    
    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(409).json({ message: "Duplicate entry error" });
    }
    
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all students 
route.get("/all-students", checkAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const students = await Student.find({ uId: userId });
    
    if (!students) {
      return res.status(404).json({ 
        message: "No students found",
        details: "No students are currently associated with this user"
      });
    }

    res.status(200).json({ students });
  } catch (error) {
    console.error('Error fetching students:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error", 
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      message: "Internal server error",
      details: "An error occurred while fetching students"
    });
  }
});
// get student by id
route.get("/student-details/:id", checkAuth, async (req, res) => {
  try {
    const studentId = req.params.id;
    const userId = req.userId;  
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ student });
  } catch (error) {
    res.status(500).json({ message: "Error fetching student details" });
  }
});

// Get a  students by course id
route.get("/all-students/:courseId", checkAuth, async (req, res) => {
  try {

    const userId = req.userId;
    const courseId = req.params.courseId;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        message: "Invalid course ID format",
        details: "Please provide a valid course ID"
      });
    }

    // Check if course exists and belongs to user
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        details: "The specified course does not exist"
      });
    }

    if (course.uId !== userId) {
      return res.status(403).json({
        message: "Unauthorized access",
        details: "You don't have permission to view students for this course"
      });
    }

    const students = await Student.find({ courseId, uId: userId });
    
    if (!students || students.length === 0) {
      return res.status(404).json({
        message: "No students found",
        details: "No students are currently enrolled in this course"
      });
    }

    res.status(200).json({ students });
  } catch (error) {
    console.error('Error fetching students by course:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation error",
        error: error.message
      });
    }
    
    res.status(500).json({
      message: "Internal server error",
      details: "An error occurred while fetching students"
    });
  }
});

// delete student by id
route.delete("/delete-student/:id", checkAuth, async (req, res) => {
  try {
    const studentId = req.params.id;
    const userId = req.userId;

    const student = await Student.findById({ _id: studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.uId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this student" });
    }

    await Student.findByIdAndDelete(studentId);
    await cloudinary.uploader.destroy(student.ImageId);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student" });
  }
});

// update student
route.put("/update-student/:id", checkAuth, async (req, res) => {
  try {
    const studentId = req.params.id;
    const { fullName, email, phone, address, courseId } = req.body;
    const userId = req.userId;
    
    const existingStudent = await Student.findById(studentId);
    
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    if (existingStudent.uId !== userId) {
      return res.status(403).json({ 
        message: "You are not authorized to update this student" 
      });
    }

    if (req.files) {
      await cloudinary.uploader.destroy(existingStudent.ImageId);
      await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        async (error, result) => {
          if (error) {
            return res.status(500).json({ message: "Error uploading image" });
          }
          
          const updatedStudent = {
            fullName,
            email,
            phone,
            address,
            courseId,
            ImageUrl: result.secure_url,
            ImageId: result.public_id,
            uId: userId,
          };
          
          const updatedStudentDoc = await Student.findByIdAndUpdate(
            studentId,
            updatedStudent,
            { new: true }
          );
          
          res.status(200).json({ 
            message: "Student updated successfully", 
            student: updatedStudentDoc 
          });
        }
      );
    } else {
      const updatedStudent = {
        fullName,
        email,
        phone,
        address,
        courseId,
        ImageUrl: existingStudent.ImageUrl,
        ImageId: existingStudent.ImageId,
        uId: userId,
      };
      
      const updatedStudentDoc = await Student.findByIdAndUpdate(
        studentId, 
        updatedStudent, 
        { new: true }
      );
      
      res.status(200).json({ 
        message: "Student updated successfully", 
        student: updatedStudentDoc 
      });
    }
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ 
      message: "Error updating student",
      details: error.message 
    });
  }
});


// get latest 5 students
route.get("/latest-students", checkAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const students = await Student.find({ uId: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    if (!students || students.length === 0) {
      return res.status(404).json({
        message: "No students found",
        details: "No students are currently associated with this user"
      }); 
    }

    res.status(200).json({ students });
  } catch (error) {
    console.error('Error fetching latest students:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation error",
        error: error.message
      });
    }
    
    res.status(500).json({
      message: "Internal server error",
      details: "An error occurred while fetching latest students"
    });
  }
});

export default route;
