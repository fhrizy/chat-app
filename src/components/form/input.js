import React from "react";

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
    <div className="flex flex-col gap-1">
      <label className="block text-base font-medium text-gray-700">{props.label}</label>
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
