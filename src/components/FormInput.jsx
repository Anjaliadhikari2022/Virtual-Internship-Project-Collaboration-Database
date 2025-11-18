import React from "react";

const FormInput = ({ label, value, onChange, type = "text" }) => {
  return (
    <div className="form-input">
      <label>{label}</label>
      <input type={type} value={value} onChange={onChange} />
    </div>
  );
};

export default FormInput;
