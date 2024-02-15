import * as React from "react";

import type { FieldProps } from "@fluentui/react-components";
import { Field, Input } from "@fluentui/react-components";

const Label = (props) => (
  <Field
    label={props.title}
    {...props}
  >
    <input type="text" id="fname" name="fname" value={props.text}/>
  </Field>
);

export default Label;