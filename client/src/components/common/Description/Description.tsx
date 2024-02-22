import * as React from "react";

import type { FieldProps } from "@fluentui/react-components";
import { Field, Input } from "@fluentui/react-components";

const Description = (props) => (
  <Field
    label="Rock Type"
    {...props}
  >
    <input type="text" id="fname" name="fname" value={props.text} height="1000px" padding-bottom="200px"/>
  </Field>
);

export default Description;