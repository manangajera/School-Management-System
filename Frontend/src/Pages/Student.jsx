import { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import { useNavigate } from "react-router-dom";
const Student = () => {  
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {  
      try {
        setLoading(true);
        const [studentsResponse, coursesResponse] = await Promise.all([
          axios.get("http://localhost:3000/student/all-students", {
            headers: {  
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("http://localhost:3000/course/all-courses", {
            headers: {  
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        ]);
        
        setStudents(studentsResponse.data.students);
        setCourses(coursesResponse.data.courses);
      } catch (error) {
        setError(error);  
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } 

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this student?");
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/student/delete-student/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
        });
        setStudents(students.filter(student => student._id !== id));
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student: " + error.message);
      }
    }
  };

  return (
    <div className="table-wrapper">
      <table className="students-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Full Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Address</th>
            <th>Course</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>

          {students.map((student) => (
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
              <td>
                {courses.find(course => course._id === student.courseId)?.courseName }
              </td>
              <td>
                <button onClick={() => navigate(`/dashboard/addStudent/${student._id}`,{state: student})}><i className="fa-solid fa-pen-to-square"></i></button>
                <button onClick={() => handleDelete(student._id)}><i className="fa-solid fa-trash"></i></button>
              </td>
            </tr>

          ))}

        </tbody>
      </table>
    </div>
  )
}

export default Student
