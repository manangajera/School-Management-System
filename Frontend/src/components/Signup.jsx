import { Link } from "react-router-dom";
import "./style.css";
import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fullName || !email || !phone || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!image) {
      toast.error("Please upload a profile picture");
      return;
    }

    if (image && !image.type.startsWith("image/")) {
      toast.error("Only image files are allowed!");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("image", image);

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/user/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Signup successful!");
      navigate("/login");
      console.log(response.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageUrl("");
  };

  return (
    <div className="signup-wrapper">
      <ToastContainer />
      <div className="signup-box">
        <div className="signup-left">
          <h3 className="signup-left-heading">School Management System</h3>
          <p className="signup-left-para">Manage your school with ease...</p>
        </div>
        <div className="signup-right">
          <form className="signup-form" onSubmit={handleSubmit} encType="multipart/form-data">
            <h1>Create an account</h1>
            <input onChange={(e) => setFullName(e.target.value)} type="text" placeholder="Institute Name" required />
            <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required />
            <input onChange={(e) => setPhone(e.target.value)} type="text" placeholder="Phone Number" required />
            <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required />
            <input ref={fileInputRef} onChange={handleImageChange} type="file" accept="image/*" required />
            {imageUrl && (
              <div className="image-preview">
                <img src={imageUrl} alt="profile" className="profile-image" />
                <span 
                  onClick={handleRemoveImage} 
                  className="remove-image-icon"
                >
                  ×
                </span>
              </div>
            )}
            <button type="submit" disabled={loading}>{loading ? "Signing up..." : "Sign Up"}</button>
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
