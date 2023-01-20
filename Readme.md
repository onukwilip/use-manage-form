# USE-MANAGE-FORM

The use-manage-form is a React hook used to manage form states in a component. As a React developer, many a time i've come across scenarios where i'll have to manage multiple states and validation logic because of a single form, that's what inspired me to develop this hook and publish it so I and developers like me can use them to make development easier.

## Installation

Inorder to install this package, one should run `npm install use-manage-form` **OR** `yarn add use-manage-form`. To install a specific version run `npm install use-manage-form@version` **OR** `yarn add use-manage-form@version`. Replace _version_ with the package version **e.g 1.0.0**.

## How to use the package

To use the package/hook, you import it at the top of your `.js`/`.ts` file.

```javascript
import { useInput, useForm } from "use-manage-form";
```

### useInput hook

The `useInput` hook is responsible for managing each input state, properties and validation. E.g:

```javascript
const { value, isValid, inputIsInValid, onChange, onBlur, reset } =
  useInput(validateFunction);
```

It returns an object containing the

- `value` of the input
- `isValid` _boolean_ if the input is valid or not (based on the validateFunction)
- `inputIsInValid` _boolean_ if the input field is inValid or not (based on the validateFunction and if the input field has been touched)
- `onChange` function to be executed inorder to change the value of the input
- `onBlur` function to be executed to indicate that the input has been touched (to set the inputIsInvalid value properly)
- `reset` function to be executed to reset the value of the input and inputWasTouched to empty and false respectively

The `useInput` hook also accepts a function `validateFunction` as a parameter that should return the input validator. It passes the input value as a parameter to the function `validateFunction`. E.g:

```javascript
useInput((/**@type String*/ value) => {
  return value.trim() !== "";
});
```

Inorder to update the input value you should pass the `onChange` function from `useInput` hook to the input's `onChange` prop. I.e:

```javascript
<input
  type="text"
  onChange={(/**@type Event */ e) => {
    onChange(e.target?.value);
  }}
  id="name"
/>
```

To perform two way binding, you also need to pass the `value` property from the `useInput` hook to the input's `value` prop. I.e:

```javascript
<input
  type="text"
  onChange={(/**@type Event */ e) => {
    onChange(e.target?.value);
  }}
  id="name"
  value={value}
/>
```

To indicate that the input was touched you'll need to pass the `onBlur` function from the `useInput` hook to the input's `onBlur` prop. I.e:

```javascript
<input
  type="text"
  onChange={(/**@type Event */ e) => {
    onChange(e.target?.value);
  }}
  onBlur={() => {
    onBlur();
  }}
  id="name"
  value={value}
/>
```

To reset an input, just call the `reset` function. E.g:

```javascript
reset();
```

You can use the `inputIsInValid` property to show some error if the input field is invalid. The difference between the `isValid` and `inputIsInValid` properties are

- `isValid` returns `true` or `false` based on the `validateFunction` passed into the `useInput` hook.
- `inputIsInValid` returns `true` or `false` based on both the `isValid` and `inputWasTouched` properties.
- `inputIsInValid` is used for error stylings. I.e: The input is always invalid because it's empty at first, therefore, the `isValid` prop returns `false`. If you use the `isValid` prop to determine the error styling (Display input error message), it will be displayed when the page is loaded, But if the `inputIsInValid` prop is used - the error would only be displayed if the user has touched the input or has clicked the submit button. E.g:

```javascript
<div>
  <input
    type="text"
    onChange={(/**@type Event */ e) => {
      onChange(e.target?.value);
    }}
    onBlur={() => {
      onBlur();
    }}
    value={value}
    id="name"
  />
  {inputIsInValid && <p className="error-text">Name must not be empty.</p>}
</div>
```

You can rename each property in case you are using multiple `useInput` . E.g:

```javascript
const {
  value: firstName,
  isValid: firstNameIsValid,
  inputIsInValid: firstNameInputIsInValid,
  onChange: firstNameChangeHandler,
  onBlur: firstNameBlurHandler,
  reset: resetFirstName,
} = useInput((value) => value.trim() !== "");
```

### useForm hook

The `useForm` hook is used to manage the states of a whole form, it manages the **formIsValid** state and other functions.

The `useForm` hook returns three properties namely:

```javascript
{
    executeBlurHandlers,
    formIsValid,
    reset,
}
```

- The `executeBlurHandlers` executes all form input `onBlur` functions passed to the `useForm` hook.
- The `formIsValid` returns `true`/`false`, based on the function passed to the useForm `hook`.
- The `reset` resets all form inputs passed to the `useForm` hook.

The `useForm` hook accepts an object containing:

- **`blurHandlers`**: The list of all input `onBlur` functions to be executed (to be executed when form is submitted, but **NOT** validated, it sets the `inputWasTouched` value of all inputs passed into it to `true` and `inputIsInValid` states to true for invalid inputs).
- **`validateOptions`**: The `validateFunction` used to determine if the form is valid or not
- **`resetHandlers`**: The list of all input `reset` functions (To reset all input values and `inputWasTouched` values to empty and false respectively)

Therefore, the `useForm` is to be called this way:

```javascript
const { executeBlurHandlers, formIsValid, reset } = useForm({
  blurHandlers: [firstNameBlurHandler, lastNameBlurHandler, emailBlurHandler],
  validateOptions: () => firstNameIsValid && lastNameIsValid && emailIsValid,
  resetHandlers: [resetFirstName, resetLastName, resetEmail],
});
```

The `onSubmit` function passed to the form could be then implemented this way:

```javascript
const onSubmit = (/**@type Event*/ e) => {
  e.preventDefault();

  if (!formIsValid) {
    executeBlurHandlers();
    return false;
  }
};
...
return(
        <form onSubmit={onSubmit}>
        </form>
    )
```

At the end our code base should be similar to this

```javascript
import { useForm, useInput } from "use-manage-form";

const BasicForm = (props) => {
  const {
    value: firstName,
    isValid: firstNameIsValid,
    inputIsInValid: firstNameInputIsInValid,
    onChange: firstNameChangeHandler,
    onBlur: firstNameBlurHandler,
    reset: resetFirstName,
  } = useInput((value) => value.trim() !== "");

  const {
    value: lastName,
    isValid: lastNameIsValid,
    inputIsInValid: lastNameInputIsInValid,
    onChange: lastNameChangeHandler,
    onBlur: lastNameBlurHandler,
    reset: resetLastName,
  } = useInput((value) => value.trim() !== "");

  const {
    value: email,
    isValid: emailIsValid,
    inputIsInValid: emailInputIsInValid,
    onChange: emailChangeHandler,
    onBlur: emailBlurHandler,
    reset: resetEmail,
  } = useInput((value) => value.trim() !== "" && value?.includes("@"));

  const { executeBlurHandlers, formIsValid, reset } = useForm({
    blurHandlers: [firstNameBlurHandler, lastNameBlurHandler, emailBlurHandler],
    validateOptions: () => firstNameIsValid && lastNameIsValid && emailIsValid,
    resetHandlers: [resetFirstName, resetLastName, resetEmail],
  });

  const firstNameInputClasses = firstNameInputIsInValid
    ? "form-control invalid"
    : "form-control";
  const lastNameInputClasses = lastNameInputIsInValid
    ? "form-control invalid"
    : "form-control";
  const emailInputClasses = emailInputIsInValid
    ? "form-control invalid"
    : "form-control";

  const onSubmit = (/**@type Event*/ e) => {
    e.preventDefault();

    if (!formIsValid) {
      executeBlurHandlers();
      return false;
    }

    console.log("SUBMIT", {
      firstName,
      lastName,
      email,
    });
    reset();
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="control-group">
        <div className={firstNameInputClasses}>
          <label htmlFor="name">First Name</label>
          <input
            type="text"
            onChange={(/**@type Event */ e) => {
              firstNameChangeHandler(e.target?.value);
            }}
            onBlur={() => {
              firstNameBlurHandler();
            }}
            value={firstName}
            id="name"
          />
          {firstNameInputIsInValid && (
            <p className="error-text">Firstame must not be empty.</p>
          )}
        </div>
        <div className={lastNameInputClasses}>
          <label htmlFor="name">Last Name</label>
          <input
            type="text"
            id="name"
            onChange={(/**@type Event */ e) => {
              lastNameChangeHandler(e.target?.value);
            }}
            onBlur={() => {
              lastNameBlurHandler();
            }}
            value={lastName}
          />
          {lastNameInputIsInValid && (
            <p className="error-text">Lastname must not be empty.</p>
          )}
        </div>
      </div>
      <div className={emailInputClasses}>
        <label htmlFor="name">E-Mail Address</label>
        <input
          type="text"
          id="name"
          onChange={(/**@type Event */ e) => {
            emailChangeHandler(e.target?.value);
          }}
          onBlur={() => {
            emailBlurHandler();
          }}
          value={email}
        />
        {emailInputIsInValid && (
          <p className="error-text">
            Email must not be empty and must be a valid email.
          </p>
        )}
      </div>
      <div className="form-actions">
        <button disabled={!formIsValid}>Submit</button>
      </div>
    </form>
  );
};

export default BasicForm;
```

Thank you, if this helped you i would appreciate you star the repo [Use-manage-form repo](https://github.com/onukwilip/use-manage-form.git)
