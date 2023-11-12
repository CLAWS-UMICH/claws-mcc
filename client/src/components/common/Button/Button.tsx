import { Button, ButtonProps } from "@fluentui/react-components";
import * as React from "react";

// Define additional parameters for ButtonProps
// ButtonProps standard parameters: appearance, disabledFocusable, disabled, iconPosition, shape, size
type CustomProps<T = React.ReactNode> = ButtonProps & {
  text?: T;
};

// General button template, renders icon if specified
export const ButtonTemplate = <T extends React.ReactNode>(props: CustomProps<T>, {icon}: {icon?: React.ReactNode}) => (
  <Button { ...props } { ...icon && <span className="icon">{icon}</span> }>
    { props.text || "Enter Text" }
  </Button>
);

// export const Default = (appearanceInput: any, disabledFocusableInput: boolean, disabledInput: boolean, 
//   iconPositionInput: any, shapeInput: any, sizeInput: any) => (
//   <Button
//     appearance={appearanceInput}
//     disabledFocusable={disabledFocusableInput}
//     disabled={disabledInput}
//     iconPosition={iconPositionInput}
//     shape={shapeInput}
//     size={sizeInput}
//     >
//     Fill Out Later
//   </Button>
// );