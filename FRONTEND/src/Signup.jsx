import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    const response = await axios.post("http://localhost:8000/admin/signup", {
      username: email,
      password: password,
    });

    let data = response.data;
    localStorage.setItem("token", data.token);
    window.location = "/";
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={signup}>Submit</button>
      </div>
    </div>
  );
}

export default Signup;
