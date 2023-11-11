import { Button, ButtonProps } from "@fluentui/react-components";
import * as React from "react";

export const Default = (appearanceInput: any, disabledFocusableInput: boolean, disabledInput: boolean, 
  iconPositionInput: any, shapeInput: any, sizeInput: any) => (
  <Button
    appearance={appearanceInput}
    disabledFocusable={disabledFocusableInput}
    disabled={disabledInput}
    iconPosition={iconPositionInput}
    shape={shapeInput}
    size={sizeInput}
    >
    Fill Out Later
  </Button>
);

