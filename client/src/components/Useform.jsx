import React, { useState } from 'react'

export function Useform(initialValue, validateOnChange = false, validate) {
    const [values, setValues] = useState(initialValue);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setValues({
            ...values,
            [name]: value
        })
        if (validateOnChange) {
            validate({[name]: value})
        }
    };
    const resetForm = () => {
        setValues(initialValue);
        setErrors({});
    }
    
  return {
    values, 
    setValues,
    resetForm,
    errors,
    setErrors,
    handleInputChange
  }
}

export function FormCustom(props) {
    const {children, ...other} = props;    
    return (
        <form {...other}>
            {props.children}
        </form>
    )
}
