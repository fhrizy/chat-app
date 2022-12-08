import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPen,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, LOGOUT } from "../../store/reducers/userReducer";
import Input from "../../components/form/input";

function Profile(props) {
  const user = useSelector(selectUser);
  const [name, setName] = useState();

  useEffect(() => {
    setName(user.name);
  }, [user.name]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = () => {
    localStorage.clear();
    dispatch(LOGOUT());
    navigate("/signin");
  };
  return (
    <div className={`slide-menu ${props.openProfile && "active"} bg-white`}>
      <div className="header">
        <div className="items">
          <div className="item" onClick={() => props.setOpenProfile(false)}>
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="text-white mx-1.5 my-1"
              size="xl"
            />
          </div>
        </div>
        <div className="items">
          <div className="item" onClick={() => logout()}>
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              className="text-white m-2"
              size="lg"
            />
          </div>
        </div>
      </div>
      <div className="profile-img"></div>
      <div className="input-edit px-5 py-3">
        <label className="">Nama Kamu</label>
        <Input
          value={name}
          className="pt-2 mr-3 pl-3 mt-1 pb-0.5 border border-transparent border-b-primary-1 bg-light focus:outline-none"
          onChange={setName}
        />
      </div>
    </div>
  );
}

export default Profile;
