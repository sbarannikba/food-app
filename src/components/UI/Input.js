import React from 'react';

import classes from './Input.module.css';

const Input = React.forwardRef((props, ref) => {
  const classesList = props.className ? classes.input + ' ' + props.className : classes.input;

  return (
    <div className={classesList}>
      <label htmlFor={props.input.id}>{props.label}</label>
      <input ref={ref} {...props.input} />
    </div>
  );
});

export default Input;
