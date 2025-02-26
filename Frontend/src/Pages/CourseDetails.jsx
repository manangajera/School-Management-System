import {useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import { useNavigate } from "react-router-dom";
const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null); 

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCourse = async () => {   
      try {
        const response = await axios.get(`http://localhost:3000/course/course-details/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCourse(response.data.course);
        setStudent(response.data.students);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);
  const handleDelete = async () => {
    // Show confirmation popup
    const isConfirmed = window.confirm("Are you sure you want to delete this course?");
    
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/course/delete-course/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }); 
        navigate("/dashboard/course");
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">Error: {error.message}</div>;


  return (
    <div className="course-details-container">
      <div className="course-details-header"> 
      <h1 className="course-title">Course Details</h1>
      </div>
      <div className="controller-btns">
        <button onClick={() => navigate(`/dashboard/addCourse/${id}`,{state: course})} className="edit-course-link">Edit Course</button >
        <button className="delete-course-btn" onClick={handleDelete}>Delete Course</button>
      </div>

      {course && (
      <div className="course-container">
        <div className="course-image-container">
         <img className="course-image" src={course.ImageUrl} alt={course.courseName} />
         <h2 className="course-name">{course.courseName}</h2>
        </div>
       <div className="course-details">
       <h2>{course.courseName}</h2>
        <p className="course-description"><b>Description:</b> {course.description}</p>
        <p className="course-price"><b>Price:</b> ${course.price}</p>
        <p className="course-dates"><b>Start Date:</b> {course.startDate}</p>
        <p className="course-dates"><b>End Date:</b> {course.endDate}</p>

      </div>
      </div>
     )}
     {student.length > 0 && (
      <div className="table-wrapper">
      <table className="students-table">

        <thead>
          <tr>
            <th>Image</th>
            <th>Full Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>

          {student.map((student) => (
            <tr key={student._id}>
              <td>
                <img 
                  src={student.ImageUrl} 
                  alt={student.fullName} 
                  className="student-thumbnail"
                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
              </td>
              <td>{student.fullName}</td>
              <td>{student.phone}</td>  
              <td>{student.email}</td>
              <td>{student.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
     )}
    

    </div>
  );
};


export default CourseDetails;
