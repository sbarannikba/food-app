import React, {useReducer, useState} from "react";
import classes from './Checkout.module.css';
import InputValidated from "../UI/InputValidated";

const defaultFormState = {
    fields: {
        name: {
            value: '',
            isValid: false
        },
        city: {
            value: '',
            isValid: false
        },
        zip: {
            value: '',
            isValid: false
        },
        street: {
            value: '',
            isValid: false
        }
    },
    isValid: false
}

const formReducer = (state, action) => {
    if(action.type === 'FIELD_CHANGED' && action.fieldName) {
        let fields = {...state.fields};
        fields[action.fieldName] = {
            value: action.value,
            isValid: action.isValid
        };
        let isValid = true;
        for (const key in fields) {
            if(fields[key].isValid !== true) {
                isValid = false;
                break;
            }
        }

        return {fields, isValid};  
    }

    return defaultFormState;
};

const Checkout = (props) => {
    const [formState, dispatchFormAction] = useReducer(formReducer, defaultFormState);
    const [isSubmitTouched, setIsSubmitTouched] = useState(false);
  
    const onFieldChangedHandler = (fieldName, data) => {
        dispatchFormAction({
            type: 'FIELD_CHANGED', 
            fieldName: fieldName, 
            value: data.value, 
            isValid: data.isValid
        });
    }

    const confirmHandler = (event) => {
        event.preventDefault();

        if(formState.isValid) {
            
        let transformedUserData = {};

        for(const key in formState.fields) {
            transformedUserData[key] = formState.fields[key].value;
        }
            props.onCheckoutSubmit(transformedUserData);
        } else {
            setIsSubmitTouched(true);
        }
    };

    return (
      <form className={classes.form} onSubmit={confirmHandler}>
        <InputValidated
            className={classes.control}
            label='Your Name'
            input={{
                id: 'name',
            }}
            validation={{
                msg: 'Please enter your name',
                validationFunction: (value) => { return value.trim().length > 3; },
                forceTouched: isSubmitTouched
            }}
            onChange={onFieldChangedHandler.bind(null, 'name')}
        />
        <InputValidated
            className={classes.control}
            label='Street'
            input={{
                id: 'street',
            }}
            validation={{
                msg: 'Please enter your street',
                validationFunction: (value) => { return value.trim().length > 5; },
                forceTouched: isSubmitTouched
            }}
            onChange={onFieldChangedHandler.bind(null, 'street')}
        />
        <InputValidated
            className={classes.control}
            label='City'
            input={{
                id: 'city',
            }}
            validation={{
                msg: 'Please enter your city',
                validationFunction: (value) => { return value.trim().length > 3; },
                forceTouched: isSubmitTouched
            }}
            onChange={onFieldChangedHandler.bind(null, 'city')}
        />
        <InputValidated
            className={classes.control}
            label='Postal Code'
            input={{
                id: 'zip',
            }}
            validation={{
                msg: 'Please enter your ZIP',
                validationFunction: (value) => { return value.trim().length > 4 && /^\d+$/.test(value); },
                forceTouched: isSubmitTouched
            }}
            onChange={onFieldChangedHandler.bind(null, 'zip')}
        />
        <div className={classes.actions}>
          <button type='button' onClick={props.onCancel}>
            Cancel
          </button>
          <button className={classes.submit}>Confirm</button>
        </div>
      </form>
    );
};

export default Checkout;