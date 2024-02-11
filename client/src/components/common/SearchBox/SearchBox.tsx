import * as React from "react";

import type { ButtonProps, FieldProps } from "@fluentui/react-components";
import { makeStyles, useId, Field, Input, Button } from "@fluentui/react-components";
import { Search12Regular, Dismiss16Regular} from "@fluentui/react-icons"


const useStyles = makeStyles({
  root: {
    display: "flex",
    rowGap: "5px",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "-10px"
  },
  input: {
    width: "230px",
    marginRight: "auto"
  },
  dismiss: {
    marginRight: "-10px"
  }
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

const SearchBox = ({handleDismiss}) => {
  const inputId = useId("search bar");
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Input className={styles.input} contentBefore={<SearchButton aria-label="Enter by voice" />} id={inputId} />
      <Button className={styles.dismiss} icon={<Dismiss16Regular/>} appearance="transparent" onClick={handleDismiss}></Button>
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