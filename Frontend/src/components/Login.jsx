import axios from "axios";
import "./style.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }


    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/user/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("fullName", response.data.user.fullName);
      localStorage.setItem("imageUrl", response.data.user.imageUrl);
      localStorage.setItem("imageId", response.data.user.imageId);
      toast.success("Login successful!");
      navigate("/dashboard");
      console.log(response.data); 
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "An error occurred during login"
      );
    } finally {
      setLoading(false);
    }
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
          <form
            className="signup-form"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <h1>Login</h1>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              required
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <p>
              Dont have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
