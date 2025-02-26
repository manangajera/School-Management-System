import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
   _id: mongoose.Types.ObjectId,
   fullName: {type: String, required: true},
   email: {type: String, required: true},
   phone: {type: String, required: true},
   address: {type: String, required: true},
   ImageId: {type: String, required: true},
   ImageUrl: {type: String, required: true},
   courseId: {type: String, required: true},
   uId: {type: String, required: true},
}, {timestamps: true})

const Student = mongoose.model("Student", studentSchema);
export default Student;