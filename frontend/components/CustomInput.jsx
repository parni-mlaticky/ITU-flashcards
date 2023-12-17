/*
 *  @author: Petr Kolouch xkolou05
 *  @project: ITU 2023
 *  @file: CustomInput.jsx
 *  @brief: Custom input component
 */
import React from "react";
import { Input } from "native-base";

const CustomInput = ({ placeholder, ...props }) => {
  return <Input placeholder={placeholder} {...props} />;
};

export default CustomInput;
