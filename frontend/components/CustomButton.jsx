/*
 *  @author: Petr Kolouch xkolou05
 *  @project: ITU 2023
 *  @file: CustomButton.jsx
 *  @brief: Custom button component
 */
import React from "react";
import { Button, Text } from "native-base";

const CustomButton = ({ title, textColor, ...props }) => {
  return (
    <Button {...props}>
      <Text color={textColor ? textColor : "white"}>{title}</Text>
    </Button>
  );
};

export default CustomButton;
