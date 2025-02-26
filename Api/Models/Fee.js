import mongoose from "mongoose";

const feeSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  courseId: { type: String, required: true },
  uId: { type: String, required: true },
  amount: { type: Number, required: true },
  remark: { type: String, required: true },
}, { timestamps: true });

const Fee = mongoose.model("Fee", feeSchema);
export default Fee;
