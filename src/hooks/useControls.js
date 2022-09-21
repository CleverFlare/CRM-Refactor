import { useCallback, useState } from "react";

const useControls = (controls = []) => {
  if (
    (Boolean(controls.length) &&
      controls.every((control) => !control.hasOwnProperty("control"))) ||
    controls.every((control) => !control.hasOwnProperty("value"))
  )
    throw Error("you have something missing in the control");

  const [state, setState] = useState(() => {
    let result = {};
    controls.map(
      (control) => (result = { ...result, [control?.control]: control?.value })
    );
    return result;
  });

  const [errors, setErrors] = useState({});

  const validate = async () => {
    let output = {};
    Object.keys(state).map((key) => {
      const control = controls.find((control) => control.control === key);

      let value =
        typeof control?.convert === "function"
          ? control?.convert(state[control.control])
          : state[control.control];

      if (value === "" && control?.isRequired) {
        output = { ...output, [control.control]: "هذا الحقل إلزامي" };
      } else if (
        Array.isArray(control?.validations) &&
        state[control.control]
      ) {
        control.validations.forEach((validation) => {
          switch (typeof validation.test) {
            case "function":
              if (!validation.test(state).test(value)) {
                output = {
                  ...output,
                  [control.control]: validation.message,
                };
              }
            default:
              if (!validation.test.test(value)) {
                output = {
                  ...output,
                  [control.control]: validation.message,
                };
              }
          }
        });
      }
    });

    setErrors(output);
    return { output, isOk: !Boolean(Object.keys(output).length) };
  };

  const setControl = useCallback(
    async (key, value) => {
      if (controls.every((control) => control.control !== key))
        return console.warn("you have passed an invalid control");

      switch (typeof value) {
        case "function":
          setState((old) => ({ ...old, [key]: value(old[key]) }));
          break;
        default:
          setState((old) => ({ ...old, [key]: value }));
      }
    },
    [controls, state]
  );

  const resetControls = useCallback(() => {
    let result = {};
    controls.map(
      (control) => (result = { ...result, [control?.control]: control?.value })
    );
    setState({ ...result });
  }, [controls, state]);

  return [
    {
      controls: state,
      required: controls.map(
        (control) => control?.isRequired && control?.control
      ),
      invalid: errors,
    },
    {
      setControl,
      resetControls,
      setInvalid: setErrors,
      validate,
    },
  ];
};

export default useControls;
