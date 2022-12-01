import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toastNotify } from "../components/helper";
import { signup } from "../store/reducers/userReducer";
import { useDispatch } from "react-redux";
import Input from "../components/form/input";
import Button from "../components/form/button";

function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { name, username, password, passwordConf, role };
    const response = await dispatch(signup(data));

    if (!response.error) {
      toastNotify(`Register user ${username} berhasil`, "success");
      navigate("/signin");
      return;
    }

    if (response.error && response.payload.status === 500)
      return toastNotify("Internal Server Error", "error");

    return toastNotify(response.payload.data.message, "warning");
  };

  return (
    <div className="flex flex-row min-h-[550px] h-3/4 w-3/5 m-auto">
      <div className="bg-sign block max-lg:hidden w-2/4"></div>
      <div className="w-2/4 max-lg:w-full max-lg:min-w-[350px] flex flex-col gap-2 justify-center items-center bg-white">
        <span className="text-xl antialiased">Sign-up</span>
        <form
          onSubmit={handleSubmit}
          className="w-3/5 flex flex-col gap-2.5 mb-3"
        >
          <Input
            className="block h-8 w-full pl-3 pr-2 rounded-md border border-gray-300 focus:outline-none focus:ring-primary-1 focus:border-primary-1 sm:text-sm"
            type="text"
            placeholder="budiono?"
            label="name"
            onChange={(e) => setName(e)}
            autoFocus={true}
          />
          <Input
            className="block h-8 w-full pl-3 pr-2 rounded-md border border-gray-300 focus:outline-none focus:ring-primary-1 focus:border-primary-1 sm:text-sm"
            type="text"
            placeholder="budi123"
            label="username"
            onChange={(e) => setUsername(e)}
            autoFocus={false}
          />
          <Input
            className="block h-8 w-full pl-3 pr-2 rounded-md border border-gray-300 focus:outline-none focus:ring-primary-1 focus:border-primary-1 sm:text-sm"
            type="password"
            placeholder="k1o2d%<$@><6,."
            label="password"
            onChange={(e) => setPassword(e)}
            autoFocus={false}
          />
          <Input
            className="block h-8 w-full pl-3 pr-2 rounded-md border border-gray-300 focus:outline-none focus:ring-primary-1 focus:border-primary-1 sm:text-sm"
            type="password"
            placeholder="k1o2d%<$@><6,."
            label="confirm password"
            onChange={(e) => setPasswordConf(e)}
            autoFocus={false}
          />
          <Input
            className="block h-8 w-full pl-3 pr-2 rounded-md border border-gray-300 focus:outline-none focus:ring-primary-1 focus:border-primary-1 sm:text-sm"
            type="text"
            placeholder="admin or user"
            label="role"
            onChange={(e) => setRole(e)}
            autoFocus={false}
          />
          <Button
            className="self-end bg-primary-1 border-transparent text-white rounded px-4 py-1"
            type="submit"
          >
            Register
          </Button>
        </form>
        <span>
          Sudah ada akun?{" "}
          <a
            href="/signin"
            className="text-secondary hover:text-primary-1 hover:decoration-primary-1 hover:underline"
          >
            Login
          </a>
        </span>
      </div>
    </div>
  );
}

export default Signup;
