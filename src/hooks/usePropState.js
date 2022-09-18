import { useEffect, useState } from "react";

const usePropState = (init) => {
  const [state, setState] = useState(null);
  useEffect(() => {
    setState(init);
  }, [init]);

  return [state, setState];
};

export default usePropState;
