import express from "express";
import userRoute from "./routes/user.js";
import courseRoute from "./routes/course.js";
import studentRoute from "./routes/student.js";
import feeRoute from "./routes/fee.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();


const app = express();
mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("Db connected"))
  .catch((error) => console.log("Error: ", error));

app.use(express.json());
app.use(cors());
// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true ,
    tempFileDir: "/tmp/"})); // Enables file upload handling

app.use(bodyParser.json());
// user routes 
app.use("/user", userRoute);
// course routes
app.use("/course", courseRoute);
// student routes
app.use("/student", studentRoute);
// fee routes
app.use("/fee", feeRoute);

// page not found
app.use("*", (req, res) => {
  res.status(404).json({
    msg: "Bad Request",
  });
});
export default app;
