import { useEffect, useRef, useState } from "react";
import useAfterEffect from "./useAfterEffect";

const usePropState = (init, listen = false, dep = [init]) => {
  const [state, setState] = useState("");
  const initialized = useRef(false);

  useAfterEffect(() => {
    setState(init);
  }, dep ?? []);

  return [state, setState];
};

export default usePropState;
