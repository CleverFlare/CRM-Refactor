import { useEffect, useState } from "react";

const usePropState = (init, listen = false) => {
  const [state, setState] = useState("");
  let dep = [];

  listen && (dep = [init]);

  useEffect(() => {
    setState(init);
  }, dep);

  return [state, setState];
};

export default usePropState;
