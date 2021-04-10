import validator from 'validator'

export const required = (value) => {
  if (!value.toString().trim().length) {
    // We can return string or jsx as the 'error' prop for the validated Component
    return <label htmlFor="" className="error">Este campo es requerido</label>;
  }
};
 
export const email = (value) => {
  if (!validator.isEmail(value)) {
    return `${value} is not a valid email.`
  }
};