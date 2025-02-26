import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const EditCourse = () => {
    const { id } = useParams();

    const [course, setCourse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {   
        const fetchCourse = async () => {
            try {
                const response = await axios.put(`http://localhost:3000/course/course-details/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },

                });
                setCourse(response.data.course);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }               
        };
        fetchCourse();

    }, [id]);   

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(course);
    }
    
    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-message">Error: {error.message}</div>;


  return (
    <div>
      <h1>Edit Course</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={course.courseName} onChange={(e) => setCourse({ ...course, courseName: e.target.value })} />
        <input type="text" value={course.description} onChange={(e) => setCourse({ ...course, description: e.target.value })} />
        <input type="text" value={course.price} onChange={(e) => setCourse({ ...course, price: e.target.value })} />
        <button type="submit">Edit Course</button>
      </form>   

    </div>
  )
}

export default EditCourse
