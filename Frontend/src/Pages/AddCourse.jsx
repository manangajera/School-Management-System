// import { useState } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useRef } from "react";

// const AddCourse = () => {
//   const [courseName, setCourseName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [image, setImage] = useState(null);
//   const [imageUrl, setImageUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const fileInputRef = useRef(null);

  

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!image) {
//       toast.error("Please upload an image");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("courseName", courseName);
//     formData.append("description", description);
//     formData.append("price", price);
//     formData.append("startDate", startDate);
//     formData.append("endDate", endDate);
//     formData.append("image", image);
//     setLoading(true);

  
//     try {
//       const response = await axios.post("http://localhost:3000/course/add-course", formData,{
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       toast.success("Course added successfully");
//         // Clear the form after successful submission
//       setCourseName("");
//       setDescription("");
//       setPrice("");
//       setStartDate("");
//       setEndDate("");
//       setImage(null);
//       setImageUrl("");
//       fileInputRef.current.value = ""; // Clear file input
//     } catch (error) {
//       console.error("Error adding course:", error);
//       toast.error("Error adding course");
//     }finally {
//       setLoading(false);
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     // Validate file type
//     if (!file.type.startsWith("image/")) {
//       toast.error("Please select a valid image file");
//       return;
//     }
//     setImage(file);
//     setImageUrl(URL.createObjectURL(file));
//   };

//   const handleRemoveImage = () => {
//     setImage(null);
//     setImageUrl("");
//     fileInputRef.current.value = ""; // Clear file input
//   };

//   return (
//     <>
//       <ToastContainer />
//       <form className="signup-form" encType="multipart/form-data" onSubmit={handleSubmit}>
//         <h1>Add Course</h1>
//             <input onChange={(e) => setCourseName(e.target.value)} type="text" placeholder="Course Name" required />
//             <input onChange={(e) => setDescription(e.target.value)} type="text" placeholder="Course Description" required />
//             <input onChange={(e) => setPrice(e.target.value)} type="number" placeholder="Course Fee" required />
//             <input onChange={(e) => setStartDate(e.target.value)} type="date" placeholder="Starting Date (MM-DD-YYYY)" required />
//             <input onChange={(e) => setEndDate(e.target.value)} type="date" placeholder="Ending Date (MM-DD-YYYY)" required />
//             <input ref={fileInputRef} onChange={handleImageChange} type="file"  required />
//             {imageUrl && (
//               <div className="image-preview">
//                 <img src={imageUrl} alt="profile" className="profile-image" />
//                 <span 
//                   onClick={handleRemoveImage} 
//                   className="remove-image-icon"
//                 >
//                   ×
//                 </span>
//               </div>
//             )}
//             <button type="submit" disabled={loading}>
//                 {loading ? "Adding Course..." : "Add Course"}
//             </button>
//           </form>
//     </>
//   )
// }


// export default AddCourse

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { useNavigate, useLocation } from "react-router-dom";


const AddCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");

  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // For popup
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const location = useLocation();
  useEffect(() => {
    if(location.state){
      console.log(location.state);
      const course = location.state;
      setCourseName(course.courseName);
      setDescription(course.description);
      setPrice(course.price);
      setStartDate(course.startDate);
      setEndDate(course.endDate);
      setImageUrl(course.ImageUrl);
    }
  }, [location.state]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {


      toast.error("Please upload an image");
      return;
    }
    const formData = new FormData();
    formData.append("courseName", courseName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("image", image);
    setLoading(true);

    try {
      await axios.post("http://localhost:3000/course/add-course", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Course added successfully");
      navigate("/dashboard/course");
      // Clear form
      setCourseName("");
      setDescription("");
      setPrice("");
      setStartDate("");
      setEndDate("");
      setImage(null);
      setImageUrl("");
      fileInputRef.current.value = ""; // Clear file input
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error("Error adding course");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("courseName", courseName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    // Only append image if a new one is selected
    if (image) {
      formData.append("image", image);
    }
    setLoading(true); // Add loading state
    try {
      await axios.put(`http://localhost:3000/course/update-course/${location.state._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Course updated successfully");
      navigate("/dashboard/course");
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error(error.response?.data?.message || "Error updating course");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {

      toast.error("Please select a valid image file");
      return;
    }
    setImage(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageUrl("");
    fileInputRef.current.value = ""; // Clear file input
  };

  return (
    <>
      <ToastContainer />
      <form className="signup-form" encType="multipart/form-data" onSubmit={location.state ? handleUpdate : handleSubmit}>
        <h1>{location.state ? "Edit Course" : "Add Course"}</h1>
        <input onChange={(e) => setCourseName(e.target.value)} type="text" placeholder="Course Name" value={courseName} required />

        <input onChange={(e) => setDescription(e.target.value)} type="text" placeholder="Course Description" value={description} required />
        <input onChange={(e) => setPrice(e.target.value)} type="number" placeholder="Course Fee" value={price} required />

        <input onChange={(e) => setStartDate(e.target.value)} type="text" placeholder="Starting Date (MM-DD-YYYY)" value={startDate} required />
          <input onChange={(e) => setEndDate(e.target.value)} type="text" placeholder="Ending Date (MM-DD-YYYY)" value={endDate} required />
        <input 
          ref={fileInputRef} 
          onChange={handleImageChange} 
          type="file"  
          required={!location.state} // Only required for new courses
        />
        {imageUrl && (
          <div className="image-preview">
            <img 
              src={imageUrl} 
              alt="preview" 
              className="preview-image" 
              onClick={() => setShowModal(true)} // Open modal on click
            />
            <span onClick={handleRemoveImage} className="remove-image-icon">×</span>
          </div>
        )}

        <button type="submit" disabled={loading}>
          {
           location.state ? loading ? "Updating Course..." : "Update Course" : loading ? "Adding Course..." : "Add Course"
          }
         

        </button>
      </form>

      {/* Image Modal */}
      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}> {/* Close on click */}
          <div className="modal-content">
            <img src={imageUrl} alt="Full Preview" />
          </div>
        </div>
      )}

    </>
  );
};

export default AddCourse;
