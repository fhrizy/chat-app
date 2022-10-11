import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toastNotify } from "../components/helper";
import { signin } from "../store/reducers/userReducer";
import Input from "../components/form/input";
import Button from "../components/form/button";

function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { username, password, role };
    const response = await dispatch(signin(data));

    if (!response.error) {
      localStorage.setItem(
        "token",
        JSON.stringify(response.payload.data.token)
      );
      navigate("/");
      return;
    }

    if (response.error && response.payload.status === 500)
      return toastNotify("Internal Server Error", "error");

    return toastNotify(response.payload.data.message, "warning");
  };

  return (
    <div className="float-form">
      <div className="main-form">
        <div className="side-background">background</div>
        <div className="form px-4">
          <form onSubmit={handleSubmit} className="w-100 gap-1 mb-3">
            <Input
              className="input-form border-primary rounded"
              type="text"
              placeholder="Username"
              label="Username"
              onChange={(e) => setUsername(e)}
              autoFocus={true}
            />
            <Input
              className="input-form border-primary rounded"
              type="password"
              placeholder="Password"
              label="Password"
              onChange={(e) => setPassword(e)}
              autoFocus={false}
            />
            <Input
              className="input-form border-primary rounded mb-1"
              type="text"
              placeholder="Role"
              label="Role"
              onChange={(e) => setRole(e)}
              autoFocus={false}
            />
            <Button
              className="bg-primary border-transparent text-white rounded px-4 py-1"
              type="submit"
            >
              Login
            </Button>
          </form>
          <span>
            Belum memiliki akun? <a href="/signup">Register</a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signin;
