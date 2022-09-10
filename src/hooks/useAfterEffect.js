import { useEffect } from "react";
import { useRef } from "react";

const useAfterEffect = (func, arr) => {
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    func();
  }, arr);
};

export default useAfterEffect;
