import React from "react";
import { Input } from "native-base";

const CustomInput = ({ placeholder, ...props }) => {
  return <Input placeholder={placeholder} {...props} />;
};

export default CustomInput;
