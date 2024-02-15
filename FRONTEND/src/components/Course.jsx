import React, { useState, useEffect } from "react";
import axios from "axios";
function Course() {
  const [course, setCourse] = useState([]);

  async function fetchData() {
    try {
      const response = await axios.get("http://localhost:8000/admin/courses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCourse(response.data.course);
    } catch (e) {
      console.log(e.message);
    }
  }

  useEffect(() => {
    fetchData();
    course.map((item) => console.log(item.title));
    // console.log(course);
  }, []);

  return (
    <div>
      <h1>Hello World</h1>
      {course.map((item) => (
        <div key={item._id}>
          <h1>{item.title}</h1>
          <h1>{item.description}</h1>
          <h1>{item.price}</h1>
          <img className="w-48 h-32" src={item.imageLink} alt={item.title} />
        </div>
      ))}
    </div>
  );
}

export default Course;
