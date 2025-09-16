import React from 'react'
import "./style.css";
function Input({label,state,setState,placeholder,type}) {
  return (
    <div className='input-wrapper'>
        <p className='label-input'>{label}</p>
        <input 
        type={type}
         placeholder={placeholder}
         value={state}
         onChange={(e) => setState(e.target.value)}
         className="custome-input" 
        />
    </div>
  );
}

export default Input