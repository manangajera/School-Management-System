import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    fullName: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    password: {type: String, required: true},
    imageUrl: {type: String, required: true},
    imageId: {type: String, required: true},
})

const User = mongoose.model("User", userSchema);
export default User;    
