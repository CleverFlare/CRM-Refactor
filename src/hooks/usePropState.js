import { useEffect, useRef, useState } from "react";
import useAfterEffect from "./useAfterEffect";

const usePropState = (init, dep = []) => {
  const [state, setState] = useState("");

  useEffect(() => {
    setState(init);
  }, dep);

  return [state, setState];
};

export default usePropState;
