import { useEffect, useState } from 'react';

export default function useForm(initialState = {}) {
  // create a state object for our inputs
  const [inputs, setInputs] = useState(initialState);
  const initialValues = Object.values(initialState).join();

  useEffect(() => {
    setInputs(initialState);
  }, [initialValues]); // watch for changes in the values, instead of the whole object which would result in an infinite loop

  // function passed to the onChange, in inputs
  function handleChange(e) {
    let { value, name, type } = e.target;
    if (type === 'number') {
      value = parseInt(value);
    }
    if (type === 'file') {
      // get first item (destructure) in the files array taken from input
      [value] = e.target.files;
    }
    setInputs({
      // copy the existing state
      ...inputs,
      [name]: value,
    });
  }

  function resetForm() {
    setInputs(initialState);
  }

  function clearForm() {
    // setInputs({});
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, ''])
    );
    setInputs(blankState);
  }
  // return the things we want to surface from this custom hook
  return { inputs, handleChange, resetForm, clearForm };
}
