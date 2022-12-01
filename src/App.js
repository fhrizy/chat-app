import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "./components/helper";
import Dashboard from "./pages";
import Signin from "./pages/signin";
import Signup from "./pages/signup";
// import "./components/styles/index.scss";

function App() {
  return (
    <>
      <div className="flex w-screen h-screen relative bg-secondary">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
