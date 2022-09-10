import { useEffect } from "react";
import { useRef } from "react";

const useAfterEffect = (func, arr) => {
  const initialRender = useRef(false);

  useEffect(() => {
    if (!initialRender.current) {
      initialRender.current = true;
      return;
    }
    func();
  }, arr);
};

export default useAfterEffect;
