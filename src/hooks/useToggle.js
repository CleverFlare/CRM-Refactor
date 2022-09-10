import { useState } from "react";

const useToggle = (init) => {
  const [state, setState] = useState(Boolean(init));

  const setToggle = (value) =>
    typeof value === "boolean" ? setState(value) : setState((old) => !old);

  return [state, setToggle];
};

export default useToggle;
