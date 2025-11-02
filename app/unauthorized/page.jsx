"use client";
import React from "react";

import { useSelector } from "react-redux";

const Unauthorized = () => {
  const role = useSelector((state) => state.auth.userData.roles);
  return <div>Unauthorized - Your role is: {role} </div>;
};

export default Unauthorized;
