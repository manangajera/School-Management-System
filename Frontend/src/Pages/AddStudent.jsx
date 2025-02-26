import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
const AddStudent = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // For popup
  const fileInputRef = useRef(null);
  const [showCourses, setShowCourses] = useState([]);
  const [course, setCourse] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (state) {
      setFullName(state.fullName);
      setEmail(state.email);
      setPhone(state.phone);
      setAddress(state.address);
      setCourse(state.courseId);
      setImage(state.ImageId);
      setImageUrl(state.ImageUrl);
    }
  }, [state]);

  useEffect(() => {
    const fetchCourses = async () => {  
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/course/all-courses",{
          headers: {  
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setShowCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }

    };
    fetchCourses();
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please upload an image");
      return;
    }
    const formData = new FormData();5
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("image", image);
    formData.append("courseId", course);
    setLoading(true);

    try {
      await axios.post("http://localhost:3000/student/add-student", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // await axios.post("http://localhost:3000/fee/add-fee", {
      //   fullName: fullName,
      //   email: email,
      //   phone: phone,
      //   courseId: course,
      //   amount: showCourses.find(c => c._id === course)?.price,
      //   remarks: "Paid",
      // }, {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("token")}`,
      //   },
      // });


      toast.success("Student added successfully");
      navigate("/dashboard/student");
      // Clear form
      setFullName("");
      setEmail("");
      setPhone("");

      setAddress("");
      setImage(null);

      setImageUrl("");

      fileInputRef.current.value = ""; // Clear file input
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("Error adding student");
    } finally {
      setLoading(false);
    }

  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("courseId", course);
    formData.append("image", image);
    setLoading(true);
    console.log(formData.get("courseId"));
    try {
      await axios.put(`http://localhost:3000/student/update-student/${state._id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Student updated successfully");
      navigate("/dashboard/student");
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("Error updating student");
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
      
      <form className="signup-form" encType="multipart/form-data" onSubmit={state ? handleUpdate : handleSubmit}>
        {state ? <h1>Edit Student</h1> : <h1>Add Student</h1>}
        <input onChange={(e) => setFullName(e.target.value)} type="text" placeholder="Student Name" required value={fullName} />
        <input onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Student Email" required value={email} />

        <input onChange={(e) => setPhone(e.target.value)} type="number" placeholder="Student Phone" required value={phone} />

        <input onChange={(e) => setAddress(e.target.value)} type="text" placeholder="Student Address" required value={address} />
        <select onChange={(e) => setCourse(e.target.value)} className="select-input" required value={course}>
          <option value="">Select Course</option>
          {showCourses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.courseName}
            </option>
          ))}
        </select>
        <input ref={fileInputRef} onChange={handleImageChange} type="file" required />

        {imageUrl && (
          <div className="image-preview">
            <img 
              src={imageUrl} 
              alt="preview" 
              className="preview-image" 
              onClick={() => setShowModal(true)} // Open modal on click
              value={imageUrl}
            />
            <span onClick={handleRemoveImage} className="remove-image-icon">×</span>
          </div>
        )}

        <button type="submit" disabled={loading}>
          {state ? loading ? "Updating Student..." : "Update Student" : loading ? "Adding Student..." : "Add Student"}
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

export default AddStudent;