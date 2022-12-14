import React from "react";
import "../styles/index.scss";

function Button(props) {
  return (
    <button
      className={`w-fit h-fit ${props.className}`}
      type={props.type}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export default Button;
