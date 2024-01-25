import * as React from "react";

import type { ButtonProps, FieldProps } from "@fluentui/react-components";
import { makeStyles, useId, Field, Input, Button } from "@fluentui/react-components";
import { Search12Regular } from "@fluentui/react-icons"


const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    rowGap: "5px",
    maxWidth: "300px",
  },
});

const SearchButton: React.FC<ButtonProps> = (props) => {
  return (
    <Button
      {...props}
      appearance="transparent"
      icon={<Search12Regular />}
      size="small"
    />
  );
};

const SearchBox = () => {
  const inputId = useId("search bar");
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Input placeholder="Search Rock" contentAfter={<SearchButton aria-label="Enter by voice" />} id={inputId} />
    </div>
  );
};
// const SearchBox = (props: Partial<FieldProps>) => (
//   <Field
//     label="Search"
//     validationState="success"
//     validationMessage="This is a success message."
//     {...props}
//   >
//     <Input />
//   </Field>
// );

export default SearchBox;