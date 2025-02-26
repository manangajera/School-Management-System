import { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import { useNavigate } from "react-router-dom";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {  
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/course/all-courses",{
          headers: {  
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCourses(response.data.courses);
      } catch (error) {
        setError(error);  
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } 

  return (
    <div className="courses-wrapper">
    
        {courses.map((course) => (
            <div key={course._id} onClick={() => navigate(`/dashboard/course-details/${course._id}`)} className="course-box">
            <img src={course.ImageUrl} alt={course.courseName} className="course-thumbnail"/>
            <div className="course-info">
            <h5 className="course-titles">{course.courseName}</h5>
            <p className="course-price">Rs.{course.price}</p>
            </div>
            </div>
        ))}
    </div>
  )

}

export default Course
