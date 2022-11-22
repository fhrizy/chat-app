import React from "react";
import "../styles/index.scss";

function Input(props) {
  if (!props.label)
    return (
      <input
        className={props.className}
        style={props.style}
        type={props.type}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
        value={props.value}
        autoFocus={props.autoFocus}
        onKeyPress={(event) => {
          event.key === "Enter" && props.onEnterKey();
        }}
        disabled={props.disabled}
      />
    );

  return (
    <div className="flex flex-column gap-1">
      <label>{props.label}</label>
      <input
        className={props.className}
        style={props.style}
        type={props.type}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
        value={props.value}
        autoFocus={props.autoFocus}
        onKeyPress={(event) => {
          event.key === props.keyPress && props.onEnterKey();
        }}
        disabled={props.disabled}
      />
    </div>
  );
}

export default Input;
