// src/components/ErrorPage.jsx
import { Link } from "react-router-dom";
import "./style.css"; // You can style this component as needed

const ErrorPage = () => {
  return (
    <div className="error-container">
      <h1>Unexpected Application Error!</h1>
      <h2>404 Not Found</h2>
      <p>Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/dashboard" className="back-home">
        Go Back Home
      </Link>
    </div>
  );
};

export default ErrorPage;
