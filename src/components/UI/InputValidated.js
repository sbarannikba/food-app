import React, {useState} from 'react';

import classes from './InputValidated.module.css';

const InputValidated = (props) => {
  const [value, setValue] = useState(props.value ? props.value : '');
  const [touchedState, setTouchedState] = useState(false);
  const touched = props.validation.forceTouched || touchedState;
  const [isValid, setIsValid] = useState(props.validation ? props.validation.validationFunction(value) : true);
  const isValidationError = touched && !isValid;
  let classesList = props.className ? classes.input + ' ' + props.className : classes.input;
  classesList = isValidationError ? classesList + ' ' + classes.error : classesList; 

  const changeValueHandler = (event) => {
    const currentVal = event.target.value;
    const isCurrentValValid = props.validation ? props.validation.validationFunction(currentVal) : true;
    setValue(currentVal);
    setIsValid(isCurrentValValid);
    props.onChange({
        value: currentVal,
        isValid: isCurrentValValid
    });
  }

  const blurHandler = () => {
    if(touchedState !== true) {
      setTouchedState(true);
    }
  }

  return (
    <div className={classesList}>
      <label htmlFor={props.input.id}>{props.label}</label>
      <input {...props.input} onChange={changeValueHandler} value={value} onBlur={blurHandler} />
      {isValidationError && <p className={classes['validation-error']}>{props.validation.msg}</p>}
    </div>
  );
};

export default InputValidated;
