import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import AddStudent from "./Pages/AddStudent";
import Student from "./Pages/Student";
import AddCourse from "./Pages/AddCourse";
import Course from "./Pages/Course";
import CollectFee from "./Pages/CollectFee";
import PaymentHistory from "./Pages/PaymentHistory";
import Home from "./Pages/Home";
import ErrorPage from "./components/ErrorPage"; // A custom error UI component
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CourseDetails from "./Pages/CourseDetails";
const router = createBrowserRouter([
  // Public routes
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },

  // Dashboard routes (protected routes could be wrapped here if needed)
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <ErrorPage />, // This will display if any child route errors occur
    children: [
      { index: true, element: <Home /> }, // Renders on "/dashboard"
      { path: "home", element: <Home /> },
      { path: "add-student", element: <AddStudent /> },
      { path: "student", element: <Student /> },
      { path: "add-course", element: <AddCourse /> },
      { path: "course", element: <Course /> },
      { path: "collect-fee", element: <CollectFee /> },
      { path: "payment-history", element: <PaymentHistory /> },
      { path: "course-details/:id", element: <CourseDetails /> },
      { path: "addCourse/:id", element: <AddCourse /> },
      { path: "addStudent/:id", element: <AddStudent /> },
      
    ],
  },

  // Catch-all route for undefined paths
  { path: "*", element: <ErrorPage /> },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};

export default App;
