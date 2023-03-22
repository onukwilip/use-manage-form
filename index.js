const { useCallback, useState } = require("react");

class InpuParams {
  constructor() {
    this.validateFunction = () => {};
    this.defaultValue = "";
  }
}

const useInput = (/**@type InpuParams | ()=>{} */ options) => {
  const [enteredValue, setEnteredValue] = useState(
    typeof options === "object" ? options?.defaultValue || "" : ""
  );
  const [inputWasTouched, setInputWasTouched] = useState(false);

  const inputIsValid =
    typeof options === "function"
      ? options(enteredValue)
      : typeof options === "object"
      ? options?.validateFunction(enteredValue)
      : true;
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
const useForm = (/**@type FormOptions */ options = {}) => {
  const formIsValid =
    typeof options.validateOptions === "function" && options?.validateOptions();

  const executeBlurHandlers = useCallback(() => {
    if (Array.isArray(options?.blurHandlers)) {
      options?.blurHandlers.forEach((blurHandler) => {
        blurHandler();
      });
    }
  }, [options?.blurHandlers]);

  const reset = useCallback(() => {
    if (Array.isArray(options?.resetHandlers)) {
      options?.resetHandlers.forEach((resetHandler) => {
        resetHandler();
      });
    }
  }, [options?.resetHandlers]);

  return {
    executeBlurHandlers: executeBlurHandlers,
    formIsValid: formIsValid,
    reset: reset,
  };
};

module.exports = {
  useInput,
  useForm,
};
