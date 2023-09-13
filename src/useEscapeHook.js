import { useEffect } from "react";

export const useEscapeHook = (close, mydoc, codeType) => {
  useEffect(() => {
    const callback = (e) => {
      if (e.code.toLowerCase() === codeType.toLowerCase()) {
        close();
      }
    };
    mydoc.addEventListener("keydown", callback);
    return function () {
      mydoc.removeEventListener("keydown", callback);
    };
  }, [close, codeType]);
};
