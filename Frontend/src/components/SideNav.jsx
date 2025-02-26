import "./style.css";
// import logoImg from "../../public/favicon.ico";
import { NavLink } from "react-router-dom";

const SideNav = () => {
  return (
    <div className="nav-container">
      <div className="brand-container">
        {/* <img src={logoImg} alt="logo" className="logo-img"/> */}
        <h4 className="brand-name">School Management System</h4>
      </div>
      <div className="menu-container">
        <NavLink  to="home" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
          <i className="fa-solid fa-house"></i>Home
        </NavLink>
        <NavLink  to="add-course" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
          <i className="fa-solid fa-plus"></i>Add Course
        </NavLink>
        <NavLink to="course" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
          <i className="fa-solid fa-list"></i>All Courses
        </NavLink>
         <NavLink  to="add-student" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
          <i className="fa-solid fa-user-plus"></i>Add Student
        </NavLink>
        <NavLink to="student" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
          <i className="fa-solid fa-users"></i>All Students
        </NavLink>
        <NavLink to="collect-fee" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
          <i className="fa-solid fa-coins"></i>Collect Fees
        </NavLink>
        <NavLink to="payment-history" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
          <i className="fa-solid fa-file-invoice-dollar"></i>Payment History
        </NavLink>
      </div>
      <div className="contact-us">
        <NavLink to="/" className="contact-us-link">
          <i className="fa-solid fa-phone"></i>Contact Us
        </NavLink>
        <div className="contact-us-icons">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="contact-us-link">
            <i className="fa-brands fa-facebook"></i>
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="contact-us-link">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="contact-us-link">   
            <i className="fa-brands fa-twitter"></i>
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="contact-us-link">
            <i className="fa-brands fa-linkedin"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
