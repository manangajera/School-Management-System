import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
   _id: mongoose.Types.ObjectId,
   courseName: {type: String, required: true},
   description: {type: String, required: true},
   price: {type: Number, required: true},
   startDate: {type: String, required: true},
   endDate: {type: String, required: true}, 
   ImageId: {type: String, required: true},
   ImageUrl: {type: String, required: true},
   uId: {type: String, required: true},
})

const Course = mongoose.model("Course", courseSchema);
export default Course;