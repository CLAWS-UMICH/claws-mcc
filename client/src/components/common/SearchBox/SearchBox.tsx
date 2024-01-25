import * as React from "react";

import type { FieldProps } from "@fluentui/react-components";
import { Field, Input } from "@fluentui/react-components";

const Box = (props: Partial<FieldProps>) => (
  <Field
    label="Search"
    validationState="success"
    validationMessage="This is a success message."
    {...props}
  >
    <Input />
  </Field>
);

export default Box;