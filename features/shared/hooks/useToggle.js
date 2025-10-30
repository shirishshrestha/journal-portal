"use client";

import { useCallback, useState } from "react";

const useToggle = () => {
  const [toggle, setToggle] = useState(false);

  const toggleItem = useCallback(() => {
    setToggle((prev) => !prev);
  }, []);

  return [toggle, toggleItem];
};

export { useToggle };
