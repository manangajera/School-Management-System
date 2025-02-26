import "./style.css";
// import signupImg from "../../public/favicon.ico";
import SideNav from "./SideNav";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
   localStorage.clear();
   navigate("/login");
  };
  return (
    <div className="dashboard-main-container">
      <div className="dashboard-container">
        <SideNav />
        <div className="main-container">
          <div className="top-bar">
            <div className="logo-container">
              <img src={localStorage.getItem("imageUrl")} className="profile-logo" alt="signup_img" />  
            </div>
            <div className="profile-container">
              <h4 className="profile-name">{localStorage.getItem("fullName")}</h4>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>
          <div className="outlet-area">
            <Outlet />  
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
