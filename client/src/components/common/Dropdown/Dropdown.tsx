import {
    Dropdown,
    makeStyles,
    Option,
    shorthands,
    useId,
    DropdownProps,
  } from "@fluentui/react-components";
  import * as React from "react";
  
  const useStyles = makeStyles({
    root: {
      // Stack the label above the field with a gap
      display: "grid",
      gridTemplateRows: "repeat(1fr)",
      justifyItems: "start",
      ...shorthands.gap("2px"),
      maxWidth: "400px",
    },
  });
  
  export const DropdownElt = (props) => {
    const dropdownId = useId("dropdown-default");
    const options = props.options;
    const styles = useStyles();
    return (
      <div className={styles.root}>
        <label id={dropdownId}>{props.title}</label>
        <Dropdown
          aria-labelledby={dropdownId}
          placeholder="Select"
          {...props}
        >
          {options.map((option) => (
            <Option key={option} disabled={option === "Option 1"}>
              {option}
            </Option>
          ))}
        </Dropdown>
      </div>
    );
  };
  
  export default DropdownElt;