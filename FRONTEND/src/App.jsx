import Appbar from "./components/Appbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./components/Signin";
import Signup from "./Signup";
import Course from "./components/Course";

function App() {
  return (
    <>
      {/* <Router>
        <Routes>
          <Route path="/" element={<Appbar />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/course" element={<Course />} />
        </Routes>
      </Router> */}

      <Course />
    </>
  );
}

export default App;
