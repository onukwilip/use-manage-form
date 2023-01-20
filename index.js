import React, { useCallback, useState } from "react";

export const useInput = (validateFunction) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [inputWasTouched, setInputWasTouched] = useState(false);

  const inputIsValid = validateFunction(enteredValue);
  const inputIsInValid = inputWasTouched && !inputIsValid;

  const onInputChangeHandler = useCallback((value) => {
    setEnteredValue(value);
  }, []);

  const onInputBlurHandler = useCallback(() => {
    setInputWasTouched(true);
  }, []);

  const reset = useCallback(() => {
    setEnteredValue("");
    setInputWasTouched(false);
  }, []);

  return {
    value: enteredValue,
    isValid: inputIsValid,
    inputIsInValid: inputIsInValid,
    onChange: onInputChangeHandler,
    onBlur: onInputBlurHandler,
    reset,
  };
};

class FormOptions {
  constructor() {
    this.blurHandlers = [];
    this.validateOptions = () => {};
    this.resetHandlers = [];
  }
}
export const useForm = (/**@type FormOptions */ options = {}) => {
  const formIsValid =
    typeof options.validateOptions === "function" && options?.validateOptions();

  const executeBlurHandlers = () => {
    if (Array.isArray(options?.blurHandlers)) {
      options?.blurHandlers.forEach((blurHandler) => {
        blurHandler();
      });
    }
  };

  const reset = () => {
    if (Array.isArray(options?.resetHandlers)) {
      options?.resetHandlers.forEach((resetHandler) => {
        resetHandler();
      });
    }
  };

  return {
    executeBlurHandlers: executeBlurHandlers,
    formIsValid: formIsValid,
    reset: reset,
  };
};
