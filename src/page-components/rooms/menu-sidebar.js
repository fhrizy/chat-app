import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, LOGOUT } from "../../store/reducers/userReducer";

function MenuSidebar() {
  const user = useSelector(selectUser);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = () => {
    localStorage.clear();
    dispatch(LOGOUT());
    navigate("/signin");
  };
  return (
    <div className="menu flex flex-center flex-column space-around">
      <div className="menu-item">
        <span>{user.name && user.name.charAt(0).toUpperCase()}</span>
        <span className="floating-detail">{user.name}</span>
      </div>
      <div className="menu-item">
        <FontAwesomeIcon icon={faPen} className="text-white m-1" size="lg" />
        <span className="floating-detail">Edit Profile</span>
      </div>
      <div className="menu-item" onClick={logout}>
        <FontAwesomeIcon
          icon={faRightFromBracket}
          className="text-white m-1"
          size="lg"
        />
        <span className="floating-detail">Logout</span>
      </div>
    </div>
  );
}

export default MenuSidebar;
