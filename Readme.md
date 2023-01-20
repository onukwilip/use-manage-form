# USE-MANAGE-FORM

The use-manage-form is a React hook used to manage form states in a component. As a React developer, many a time i've come across scenarios where i'll have to manage multiple states and validation logic because of a simgle form, that's what inspired me to develop this hook and publish it so I and developers like me can use them to make development easier.

## Installation

Inorder to install this package, one should run `npm install use-manage-form` **OR** `yarn add use-manage-form`. To install this a specific version run `npm install use-manage-form@version` **OR** `yarn add use-manage-form@version`. Replace _version_ with the package version **e.g 1.0.0**.

## How to use the package

To use the package/hook, you import it at the top of your `.js`/`.ts` file.

```javascript
import { useInput, useForm } from "use-manage-form";
```

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

To perform to way binding, you also need to pass the `value` property from the `useInput` hook to the input's `value` prop. I.e:

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
