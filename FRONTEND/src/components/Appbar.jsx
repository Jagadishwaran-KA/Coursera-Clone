import React from "react";

function Appbar() {
  return (
    <div className="flex justify-evenly cursor-pointer mt-4 font-sans font-semibold">
      <a href="/">HeyCourse</a>
      <a href="/signin">Sign In</a>
      <a href="signup">Sign Up</a>
    </div>
  );
}

export default Appbar;
