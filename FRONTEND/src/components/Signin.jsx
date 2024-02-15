import axios from "axios";
import React from "react";
import { useState } from "react";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signin = async () => {
    const response = await axios.post("http://localhost:8000/admin/login", {
      username: email,
      password: password,
    });

    let data = response.data;
    alert(data.message);
    localStorage.setItem("token", data.token);
    window.location = "/";
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={signin}>Submit</button>
      </div>
    </div>
  );
}

export default Signin;
